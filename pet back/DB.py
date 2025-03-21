import jwt.exceptions
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
from pymongo.errors import PyMongoError
import bcrypt
import jwt
from datetime import datetime
from fastapi import HTTPException
from pymongo.errors import PyMongoError
from fastapi.responses import StreamingResponse
from bson import ObjectId
from io import BytesIO
import os
from fastapi import UploadFile
import boto3
from botocore.exceptions import ClientError
import logging
import configparser

try:
    with open("config.json", "r") as config_file:
        config = json.load(config_file)
    s3 = boto3.client(
        "s3",
        aws_access_key_id=config["aws-s3"]["aws_access_key_id"],
        aws_secret_access_key=config["aws-s3"]["aws_secret_access_key"],
    )
except Exception as e:
    print(e)

try:
    with open("config.json", "r") as config_file:
        config = json.load(config_file)

    uri = config["mogoDB"]["mongoURI"]
    client = MongoClient(uri, server_api=ServerApi("1"))  # Define client here
    client.admin.command("ping")  # Check connection
    print("Pinged your deployment. You successfully connected to MongoDB!")

    db = client["PetNgo"]  # Ensure this is inside try block
    pet_collection = db["Pet"]
    user_collection = db["User"]
    logins_collection = db["logins"]
    pet_images_collection = db["Pet-Image"]
    contact_collection = db["contact_requests"]
    docs_collection = db["vaccination_certificate"]

except Exception as e:
    print("Error connecting to MongoDB:", e)



# Ensure 2dsphere index for location (run once during initialization)
async def create_indexes():
    try:
        await pet_collection.create_index([("location", "2dsphere")])
    except PyMongoError as e:
        print(f"Error creating index: {e}")

    # Call this function at startup
    await create_indexes()


# Count Users Function
def count_users():
    try:
        count = user_collection.count_documents({"isDeleted": False})
        return {"user_count": count}
    except PyMongoError as e:
        return {"error": f"Database error: {str(e)}"}


# Count Pets Function
def count_pets():
    try:
        count = pet_collection.count_documents({"isDeleted": False})
        return {"pet_count": count}
    except PyMongoError as e:
        return {"error": f"Database error: {str(e)}"}


# Update Pet Location
async def update_pet_location(pet_id: str, longitude: float, latitude: float):
    try:
        result = pet_collection.update_one(
            {"_id": ObjectId(pet_id)},
            {
                "$set": {
                    "location": {"type": "Point", "coordinates": [longitude, latitude]}
                }
            },
        )
        if result.matched_count == 0:
            return {"error": "Pet not found"}
        return {"message": "Pet location updated successfully"}
    except PyMongoError as e:
        return {"error": f"Database error: {str(e)}"}


# Find Pets Near a Specific Location
async def find_nearby_pets(longitude: float, latitude: float, max_distance: int = 1000):
    try:
        nearby_pets = pet_collection.find(
            {
                "location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [longitude, latitude],
                        },
                        "$maxDistance": max_distance,
                    }
                }
            }
        )
        return list(nearby_pets)
    except PyMongoError as e:
        return {"error": f"Database error: {str(e)}"}


async def create_pet(pet_data, images, vaccination_docs):
    try:
        # print(vaccination_docs)
        photo_ids = []
        docs_ids = []
        # Step 1: Store images and collect the generated IDs
        if images:
            for image in images:
                # Read image data asynchronously
                image_content = await image.read()
                object_key = f"pets/{image.filename}"
                try:
                    response = s3.put_object(
                        Bucket="petngobucket",
                        Key=object_key,
                        Body=image_content,
                        ContentType=image.content_type,
                    )
                    image_url = f"https://petngobucket.s3.amazonaws.com/{object_key}"
                except ClientError as e:
                    logging.error(e)

                photo_ids.append(image_url)
                # print(photo_ids)
            # Add photoIds to the pet data
            pet_data["photoIds"] = photo_ids
            # print(pet_data)

            # vacccination DOcs
        if vaccination_docs:
            # print("vaccination_docs")
            for docs in vaccination_docs:
                docs_content = await docs.read()
                object_key = f"Vaccination_docs/{docs.filename}"
                try:
                    response = s3.put_object(
                        Bucket="petngobucket",
                        Key=object_key,
                        Body=docs_content,
                        ContentType=docs.content_type,
                    )
                    docs_url = f"https://petngobucket.s3.amazonaws.com/{object_key}"
                except ClientError as e:
                    logging.error(e)

                # print(vaccination_docs_data)
                docs_ids.append(docs_url)
                # print(photo_ids)
            # Add photoIds to the pet data
            pet_data["docsIds"] = docs_ids

        # Step 2: Store pet data with image IDs in MongoDB
        response = pet_collection.insert_one(pet_data)
        return {"id": str(response.inserted_id), "message": "Pet created successfully"}

    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


def create_user(data):
    try:
        with open("config.json", "r") as config_file:
            config = json.load(config_file)

        data = dict(data)
        existing_user_phone = user_collection.find_one({"phone": data["phone"]})

        if existing_user_phone:
            # If a user with the same email or phone number exists, raise an error
            raise HTTPException(status_code=400, detail="Phone number already exists")

        existing_user_email = user_collection.find_one({"email": data["email"]})
        if existing_user_email:
            # If a user with the same email or phone number exists, raise an error
            raise HTTPException(status_code=400, detail="Email already exists")

        bytes = data["password"].encode(config["bcrypt"]["encode_type"])
        salt = bcrypt.gensalt(config["bcrypt"]["salt"])
        data["password"] = bcrypt.hashpw(bytes, salt)

        response = user_collection.insert_one(data)
        return str(response.inserted_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def get_image_by_id(image_id: str):
    try:
        # Validate the ObjectId
        if not ObjectId.is_valid(image_id):
            return {"error": "Invalid image ID format"}

        # Find the image in the collection
        image_data = pet_images_collection.find_one({"_id": ObjectId(image_id)})

        if not image_data:
            return {"error": "Image not found"}

        # Get the image binary data and content type
        # print(image_data)
        image_binary = image_data.get("data")
        content_type = image_data.get(
            "contentType", "image/jpeg"
        )  # default to jpeg if not specified

        if not image_binary:
            return {"error": "Image data not found"}

        # Create a BytesIO stream from the binary data
        image_stream = BytesIO(image_binary)

        # Return the image as a StreamingResponse
        return StreamingResponse(image_stream, media_type=content_type)

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}


def get_doc_by_id(doc_id: str):
    try:
        # Validate the ObjectId
        if not ObjectId.is_valid(doc_id):
            return {"error": "Invalid document ID format"}

        # Find the image in the collection
        image_data = docs_collection.find_one({"_id": ObjectId(doc_id)})

        if not image_data:
            return {"error": "document not found"}

        # Get the image binary data and content type
        # print(image_data)
        image_binary = image_data.get("data")
        content_type = image_data["content_type"]  # default to jpeg if not specified
        # print(content_type)
        if not image_binary:
            return {"error": "document data not found"}

        # Create a BytesIO stream from the binary data
        doc_stream = BytesIO(image_binary)

        # Return the image as a StreamingResponse
        return StreamingResponse(doc_stream, media_type=content_type)

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}


# trying filtering data by pet id
# Updated DB.all() function to accept an optional filter parameter for pet type
def all(pet_type=None):
    try:
        query = {"isDeleted": False}  # Default query to fetch all pets

        # If a specific pet type is provided, add it to the query
        if pet_type:
            query["type"] = pet_type

        response = pet_collection.find(query)
        data = []
        for i in response:
            i["_id"] = str(i["_id"])
            data.append(i)
        return data
    except PyMongoError as e:
        return {"error": f"Database error: {str(e)}"}


def get_recent_pets(limit=4):
    try:
        # Query to find the most recent pets, sorted by creation time
        response = (
            pet_collection.find({"isDeleted": False}).sort("_id", -1).limit(limit)
        )
        recent_pets = []

        # Convert ObjectId to string for easier JSON handling
        for pet in response:
            pet["_id"] = str(pet["_id"])
            recent_pets.append(pet)

        return recent_pets
    except PyMongoError as e:
        return {"error": f"Database error: {str(e)}"}


def pet_info(pet_id):
    try:
        # Check if pet_id is a valid ObjectId
        if not ObjectId.is_valid(pet_id):
            return {"error": "Invalid Pet ID format"}

        # Perform the aggregation to populate the user information
        pipeline = [
            {"$match": {"_id": ObjectId(pet_id), "isDeleted": False}},
            {
                "$lookup": {
                    "from": "User",  # Name of the user collection
                    "localField": "userId",  # Field in pet_collection that references user
                    "foreignField": "_id",  # Field in users_collection that is referenced
                    "as": "user_info",  # Alias for the joined user data
                }
            },
            {
                "$project": {
                    "name": 1,  # Include pet name
                    "age": 1,  # Include pet age
                    "type": 1,  # Include pet type
                    "description": 1,  # Include pet description
                    "sex": 1,  # Include pet gender
                    "photoIds": 1,
                    "userId": 1,
                    "address": 1,
                    "docsIds": 1,
                    "location": 1,
                    "user_info.name": 1,  # Only include user's name
                    "user_info.phone": 1,  # Only include user's phone
                }
            },
        ]

        # Execute the aggregation pipeline
        result = list(pet_collection.aggregate(pipeline))
        # print(result)
        # Check if result is empty
        if not result:
            return {"error": "Pet not found"}

        pet_data = result[0]  # Since we expect one result

        # Convert ObjectId to string
        pet_data["_id"] = str(pet_data["_id"])
        user_data = user_collection.find_one({"_id": ObjectId(pet_data["userId"])})

        # Check if user_info exists and is populated

        pet_data["user_info"] = {
            "name": user_data.get("name"),
            "phone": user_data.get("phone"),
        }

        return pet_data

    except PyMongoError as e:
        return {"error": f"Database error: {str(e)}"}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}


def update_pet_info(pet_id: str, data: dict):
    try:
        response = pet_collection.find_one_and_update(
            {"_id": ObjectId(pet_id)}, {"$set": data}, return_document=True
        )
        if response is None:
            return {"error": "Pet not found"}

        # Convert ObjectId to string
        if "_id" in response:
            response["_id"] = str(response["_id"])

        return response
    except PyMongoError:
        return "something went wrong"


def delete_pet(user_id: str, pet_id: str):
    try:
        # Attempt to find and update the pet with `isDeleted` flag
        response = pet_collection.find_one_and_update(
            {
                "userId": user_id,
                "_id": ObjectId(pet_id),
                "isDeleted": False,
            },  # Ensure we target undeleted pets only
            {"$set": {"isDeleted": True}},
            return_document=True,  # Return the updated document after the update
        )

        # If the pet wasn't found, return an error message
        if response is None:
            return {"error": "Pet not found or already deleted"}

        # Convert ObjectId to string for easier JSON handling
        response["_id"] = str(response["_id"])

        return {"message": "Pet deleted successfully"}
    except PyMongoError as e:
        return {"error": "Something went wrong", "details": str(e)}


# User


def login_user(data: dict):
    try:
        with open("config.json", "r") as config_file:
            config = json.load(config_file)
        response = user_collection.find_one(
            {"email": data["email"], "isDeleted": False}
        )
        # print(response)
        if response is None:
            raise HTTPException(status_code=400, detail="email or password is wrong")

        if "_id" in response:
            response["_id"] = str(response["_id"])

        userBytes = data["password"].encode(config["bcrypt"]["encode_type"])
        result = bcrypt.checkpw(userBytes, response["password"])
        if result is False:
            raise HTTPException(status_code=400, detail="email or password is wrong")

        # Check if user is admin
        is_admin = response.get("isAdmin", False)

        ct = datetime.now()
        ts = ct.timestamp() + (20 * 60)

        bytes = response["_id"].encode(config["bcrypt"]["encode_type"])
        salt = bcrypt.gensalt(config["bcrypt"]["salt"])
        hased_user_id = bcrypt.hashpw(bytes, salt)

        payload = {"user_id": str(hased_user_id), "exp": ts, "is_admin": is_admin}
        encoded_jwt = jwt.encode(
            payload, config["jwt"]["secret"], algorithm=config["jwt"]["algorithm"]
        )
        save_token = logins_collection.find_one_and_update(
            {"userId": response["_id"]},
            {"$set": {"token": encoded_jwt, "loginTime": ct}},
            upsert=True,
        )

        return {
            "message": "logged in successfully",
            "token": encoded_jwt,
            "userId": response["_id"],
            "is_admin": is_admin,
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def verify_admin(user_id, token):
    try:
        with open("config.json", "r") as config_file:
            config = json.load(config_file)

        decoded_token = jwt.decode(
            token, config["jwt"]["secret"], algorithms=config["jwt"]["algorithm"]
        )

        # Check if the token belongs to an admin
        if not decoded_token.get("is_admin", False):
            raise HTTPException(status_code=403, detail="Admin privileges required.")

        endcoded_user_id = user_id.encode(config["bcrypt"]["encode_type"])
        result = bcrypt.checkpw(
            endcoded_user_id, bytes(decoded_token["user_id"][2:-1], "utf-8")
        )
        if result is False:
            raise HTTPException(status_code=401, detail="login again")

    except jwt.exceptions.DecodeError or jwt.exceptions.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail="login again")

    except jwt.exceptions.ExpiredSignatureError as e:
        decoded_token = jwt.decode(
            token,
            config["jwt"]["secret"],
            algorithms=config["jwt"]["algorithm"],
            options={"verify_exp": False},
        )
        endcoded_user_id = user_id.encode(config["bcrypt"]["encode_type"])
        result = bcrypt.checkpw(
            endcoded_user_id, bytes(decoded_token["user_id"][2:-1], "utf-8")
        )
        if result is False:
            raise HTTPException(status_code=401, detail="login again")

        ct = datetime.now()
        ts = ct.timestamp() + (20 * 60)
        payload = {"user_id": decoded_token["user_id"], "exp": ts}
        encoded_jwt = jwt.encode(
            payload, config["jwt"]["secret"], algorithm=config["jwt"]["algorithm"]
        )
        return encoded_jwt

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def verify_token(user_id, token):
    try:
        with open("config.json", "r") as config_file:
            config = json.load(config_file)

        decoded_token = jwt.decode(
            token, config["jwt"]["secret"], algorithms=config["jwt"]["algorithm"]
        )

        endcoded_user_id = user_id.encode(config["bcrypt"]["encode_type"])
        result = bcrypt.checkpw(
            endcoded_user_id, bytes(decoded_token["user_id"][2:-1], "utf-8")
        )
        if result is False:
            raise HTTPException(status_code=401, detail="login again")
    except jwt.exceptions.DecodeError or jwt.exceptions.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail="login again123")

    except jwt.exceptions.ExpiredSignatureError as e:
        decoded_token = jwt.decode(
            token,
            config["jwt"]["secret"],
            algorithms=config["jwt"]["algorithm"],
            options={"verify_exp": False},
        )
        endcoded_user_id = user_id.encode(config["bcrypt"]["encode_type"])
        result = bcrypt.checkpw(
            endcoded_user_id, bytes(decoded_token["user_id"][2:-1], "utf-8")
        )
        if result is False:
            raise HTTPException(status_code=401, detail="login again")

        ct = datetime.now()
        ts = ct.timestamp() + (20 * 60)
        payload = {"user_id": decoded_token["user_id"], "exp": ts}
        encoded_jwt = jwt.encode(
            payload, config["jwt"]["secret"], algorithm=config["jwt"]["algorithm"]
        )
        return encoded_jwt

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def User_info(User_id: str):
    try:
        response = user_collection.find_one(
            {"_id": ObjectId(User_id), "isDeleted": False}
        )
        if response is None:
            raise HTTPException(status_code=400, detail="User not found")

        # Convert ObjectId to string
        if "_id" in response:
            response["_id"] = str(response["_id"])

        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def update_User_info(user_id: str, data: dict):
    try:
        response = user_collection.find_one_and_update(
            {"_id": ObjectId(user_id)}, {"$set": data}, return_document=True
        )
        if response is None:
            return {"error": "User not found"}

        # Convert ObjectId to string
        if "_id" in response:
            response["_id"] = str(response["_id"])

        return response
    except PyMongoError:
        return "something went wrong"


def delete_User(user_id: str):
    try:
        # print(user_id)
        user_response = user_collection.find_one_and_update(
            {"_id": ObjectId(user_id)}, {"$set": {"isDeleted": True}}
        )

        pet_response = pet_collection.update_many(
            {"userId": (user_id)}, {"$set": {"isDeleted": True}}
        )
        if user_response is None:
            return {"error": "something went wrong"}

        # Convert ObjectId to string
        if "_id" in user_response:
            user_response["_id"] = str(user_response["_id"])

        return user_response
    except PyMongoError:
        return "something went wrong"


def get_user_pets(user_id: str):
    try:
        # Check if user_id is a valid ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID format")

        # Perform query to find pets by userId
        pets = pet_collection.find({"isDeleted": False, "userId": user_id}).sort(
            "_id", -1
        )

        user_pets = []
        for pet in pets:
            # Convert ObjectId to string and format the pet data
            pet["_id"] = str(pet["_id"])
            user_pet_data = {
                "id": pet["_id"],
                "name": pet["name"],
                "type": pet["type"],
            }

            # Include photoIds only if they are available
            if "photoIds" in pet:
                user_pet_data["photoIds"] = pet["photoIds"]

            user_pets.append(user_pet_data)

        # Check if no pets were found
        if not user_pets:
            raise HTTPException(status_code=404, detail="No pets found for this user")

        return user_pets

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def get_user_pet(user_id: str, pet_id: str):
    try:
        # Check if user_id and pet_id are valid ObjectId
        if not ObjectId.is_valid(user_id) or not ObjectId.is_valid(pet_id):
            raise HTTPException(
                status_code=400, detail="Invalid user ID or pet ID format"
            )
        # print(user_id, pet_id)
        # Convert IDs to ObjectId
        user_object_id = ObjectId(user_id)
        pet_object_id = ObjectId(pet_id)

        # Find the pet by userId and petId
        pet = pet_collection.find_one({"_id": pet_object_id, "userId": user_id})
        # print(pet)
        if not pet:
            raise HTTPException(status_code=404, detail="Pet not found for this user")

        # Convert ObjectId to string and format the pet data
        pet["_id"] = str(pet["_id"])

        return pet

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def create_request(contact_data):
    try:
        ct = datetime.now()
        contact_data["dateCreated"] = ct
        response = contact_collection.insert_one(contact_data)
        return {
            "message": "Contact request submitted successfully",
            "id": str(response.inserted_id),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def get_requests():
    try:
        response = contact_collection.find()
        contact_requests = []
        for contact in response:
            contact["_id"] = str(contact["_id"])  # Convert ObjectId to string
            contact_requests.append(contact)
        return contact_requests

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
