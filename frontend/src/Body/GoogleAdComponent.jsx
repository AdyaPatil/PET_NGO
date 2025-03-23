import React, { useEffect } from "react";
import {google_Ads_Slot, google_Ads_Client} from "../../config/config.json"
const GoogleAd = ({ adClient, adSlot, adFormat }) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={google_Ads_Client}
      data-ad-slot={google_Ads_Slot}
      data-ad-format={"auto"}
    ></ins>
  );
};

export default GoogleAd;
