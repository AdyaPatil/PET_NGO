from fastapi import (
    FastAPI,
    Body,
    HTTPException,
    Depends,
    Query,
    Request,
    File,
    UploadFile,
    Form,
)
import google.generativeai as genai
from fastapi.staticfiles import StaticFiles
import aiofiles  # For asynchronous file handling
import os
import uvicorn
import DB
import model
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from typing import Optional, List
import json


app = FastAPI()

# origins = ["http://localhost:3000", "http://192.168.0.224:3000"]
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load Google API key from config.json
with open("config.json") as config_file:
    config_data = json.load(config_file)
    GOOGLE_API_KEY = config_data.get("google-api-key", {}).get("GOOGLE_API_KEY")

#Validate presence of API key
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is missing in config.json")

# Create upload folder if not exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

# Configure Google GenAI with API key
genai.configure(api_key=GOOGLE_API_KEY)
generative_model = genai.GenerativeModel("gemini-pro")

# Token verification logic
def get_token(user_id: str, req: Request):
    try:
        if "Authorization" not in req.headers:
            raise HTTPException(status_code=401, detail="login again...")

        token = req.headers["Authorization"].split(" ")[1]
        if not token:
            raise HTTPException(status_code=401, detail="login again")

        token_status = DB.verify_token(user_id, token)
        return token_status

    except HTTPException as e:
        raise e
    except Exception as e:
        raise e


# Update Pet Location API
@app.put("/pet/{pet_id}/location")
async def update_pet_location(pet_id: str, longitude: float, latitude: float):
    result = DB.update_pet_location(pet_id, longitude, latitude)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


# Find Nearby Pets API
@app.get("/pets/nearby")
async def get_nearby_pets(longitude: float, latitude: float, max_distance: int = 1000):
    pets = DB.find_nearby_pets(longitude, latitude, max_distance)
    if "error" in pets:
        raise HTTPException(status_code=500, detail=pets["error"])
    return pets


# fitlering data with pet id
@app.get("/all/pets")
async def get_pets(type: str = None):  # Add an optional query parameter 'type'
    try:
        # Pass the type parameter to the DB function if provided
        data = DB.all(type)

        # Check for errors returned by the DB function
        if "error" in data:
            raise HTTPException(status_code=500, detail=data["error"])

        return {"data": data}
    except HTTPException as e:
        raise e  # Raise the caught HTTPException as is
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")


@app.get("/pets/recent")
async def get_recent_pets():
    try:
        # Call the helper function to get the 4 most recent pets
        recent_pets = DB.get_recent_pets()

        # Check if there was an error in the DB response
        if "error" in recent_pets:
            raise HTTPException(status_code=500, detail=recent_pets["error"])

        return {"recent_pets": recent_pets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/images/{image_id}")
async def get_image(image_id: str):
    try:
        # Call the helper function to get the image by ID
        image_response = DB.get_image_by_id(image_id)

        # Check if an error occurred
        if isinstance(image_response, dict) and "error" in image_response:
            raise HTTPException(status_code=404, detail=image_response["error"])

        return image_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/documents/{doc_id}")
async def get_image(doc_id: str):
    try:
        # Call the helper function to get the image by ID
        image_response = DB.get_doc_by_id(doc_id)

        # Check if an error occurred
        if isinstance(image_response, dict) and "error" in image_response:
            raise HTTPException(status_code=404, detail=image_response["error"])
        # print(image_response)
        return image_response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/user/{user_id}/create-pet")
async def create_pet(
    user_id: str,
    token: str = Depends(get_token),  # Change this line
    name: str = Body(...),
    age: int = Body(...),
    type: str = Body(...),
    description: str = Body(...),
    sex: str = Body(...),
    images: List[UploadFile] = File(None),  # Ensure this is a List
    vaccination_docs: List[UploadFile] = File(None),
    address: str = Body(...),
    lat: float = Body(...),
    lng: float = Body(...),
):
    try:

        pet_data = {
            "userId": user_id,
            "name": name,
            "age": age,
            "type": type,
            "description": description,
            "sex": sex,
            "address": address,
            "location": {
                "lat": lat,
                "lng": lng,
            },
            "isDeleted": False,
        }

        prompt = f"The following animal species is being checked for its legality in India: {type}. \
    Based on Indian wildlife protection laws and conservation status, respond whether the animal is legal or illegal to own or trade. \
    If it’s not known, mention that too. Provide a brief and precise answer."

        # print(prompt)
        # Generate the response using the model
        response = generative_model.generate_content(prompt)
        # print(response.text)
        if response.text == "Illegal":
            raise HTTPException(
                status_code=400,
                detail=f"It's illegal in India to trade or own the {pet_data['type']}",
            )

        data = await DB.create_pet(pet_data, images, vaccination_docs)
        if token is not None:
            return {"created": data, "token": token}
        return {"created": data}
    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/pet/{petid}")
async def get_pet_info(petid: str):
    try:
        # Get pet info from the DB function
        data = DB.pet_info(petid)

        # Check for errors returned by the DB function
        if "error" in data:
            raise HTTPException(status_code=404, detail=data["error"])

        return {"petinfo": data}
    except HTTPException as e:
        raise e  # Raise the caught HTTPException as is
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")


# search pet
@app.get("/pets/search")
async def search_pets(
    page: Optional[int] = Query(0),
    search: Optional[str] = Query(None),
    name: Optional[str] = Query(None),
    age: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    sex: Optional[str] = Query(None),
    address: Optional[str] = Query(None),
):
    try:
        # Build the query based on the provided search parameters
        if search:
            try:
                search_int = int(search)
            except ValueError:
                search_int = search
        query = {"isDeleted": False}
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"age": search_int},
                {"type": {"$regex": search, "$options": "i"}},
                {"sex": {"$regex": search, "$options": "i"}},
                {"address": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
            ]

        if name and name != "":
            query["name"] = {"$regex": name, "$options": "i"}  # Case-insensitive search
        if age and age != "":
            query["age"] = int(age)
        if type and type != "":
            query["type"] = {"$regex": type, "$options": "i"}  # Case-insensitive search
        if sex and sex != "":
            query["sex"] = sex
        if address and address != "":
            query["address"] = {
                "$regex": address,
                "$options": "i",
            }  # Case-insensitive search

        # Fetch matching pets from the database
        pet_count = 9
        print(query)
        matching_pets = list(
            DB.pet_collection.find(query)
            .skip(page * pet_count)
            .limit(pet_count)
            .sort("_id", -1)
        )

        # Format the data to return
        result = []
        for pet in matching_pets:
            pet["_id"] = str(pet["_id"])  # Convert ObjectId to string
            result.append(pet)

        return {"pets": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.put("/pet/{petid}/update")
async def update_pet_info(petid: str, data: dict = Body(...)):
    try:
        updated_data = DB.update_pet_info(petid, data)
        return {"updated_data": updated_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"something went wrong: {str(e)}")


@app.delete("/user/{user_id}/pet/{petid}")
async def delete_pet(petid: str, user_id: str):
    try:
        # Call the database function to delete the pet
        result = DB.delete_pet(user_id, petid)

        # Check if the deletion was successful or if an error occurred
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# User


@app.post("/user-register")
async def create_user(data: model.User):
    try:
        id = DB.create_user(data)
        return {"id": id}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/login")
def login_user(data: dict = Body(...)):
    try:
        # print(data)
        response = DB.login_user(data)
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/user/{user_id}")
def get_user_info(user_id: str, token=Depends(get_token)):
    try:
        data = DB.User_info(user_id)

        if token is not None:
            return {"userinfo": data, "token": token}
        return {"userinfo": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.put("/user/{userid}/update")
async def update_user_info(userid: str, data: dict = Body(...)):
    try:
        updated_data = DB.update_User_info(userid, data)
        return {"updated_data": updated_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"something went wrong: {str(e)}")


@app.delete("/user/{user_id}")
async def delete_user(user_id: str, token=Depends(get_token)):
    try:
        # print(user_id)
        deleted_data = DB.delete_User(user_id)
        return {"User deleted"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"something went wrong: {str(e)}")


@app.get("/user/{user_id}/pets")
def get_user_info(user_id: str, token=Depends(get_token)):
    try:
        data = DB.get_user_pets(user_id)

        if token is not None:
            return {"petlist": data, "token": token}
        return {"petlist": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/user/{user_id}/pet/{pet_id}")
def get_user_info(user_id: str, pet_id: str, token=Depends(get_token)):
    try:
        data = DB.get_user_pet(user_id, pet_id)
        # print(data)
        if token is not None:
            return {"petinfo": data, "token": token}
        return {"petinfo": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# POST API to submit a new contact request
@app.post("/contact")
async def submit_contact_request(data: model.ContactUsRequest):
    try:
        # Prepare the data and add the dateCreated field
        contact_data = dict(data)
        data = DB.create_request(contact_data)
        return {"submited": data}

    except Exception as e:
        raise e


# GET API to retrieve all contact requests
@app.get("/contact/list")
async def get_all_contact_requests():
    try:
        data = DB.get_requests()
        return data
    except Exception as e:
        raise e


# Main entry point
if __name__ == "__main__":
    uvicorn.run(app="main:app", host="127.0.0.1", port=8000, reload=True)
