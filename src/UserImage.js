import React, { useState, useEffect } from "react";

function UserImage({ record, width, border, margin }) {
  const [userImage, setUserImage] = useState(null);

  async function cacheImage(id, imageUrl) {
    const cache = await caches.open(id);
    const isCached = await cache.match(imageUrl);

    if (isCached !== undefined) return;
    await cache.add(imageUrl);
  }

  async function loadCachedImage(id, imageUrl) {
    const cache = await caches.open(id);

    const response = await cache.match(imageUrl);

    if (response === undefined) {
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      setUserImage(url);
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (!record) return;
    const isFullUrl = String(record.imageUrl).startsWith("http");
    const imageUrl = isFullUrl
      ? record.imageUrl
      : `https://assets.csaposapp.hu/assets/images/${record.imageUrl}`;

    const newImage = new Image();
    newImage.src = imageUrl;
    newImage.onload = async () => {
      localStorage.setItem(record.id, imageUrl);
      setUserImage(newImage);
    };
  }, [record]);

  return (
    localStorage.getItem(record?.id) && userImage ? 
    <div className={`avatar ${border ? "border-2 rounded-full" : ""} ${margin}`}>
      <div className={`${width} rounded-full bg-gray-300 flex items-center justify-center overflow-hidden`}>
        <img src={localStorage.getItem(record?.id) || userImage} alt="kép" className="w-full h-full object-cover"/>
      </div>
    </div> :
    <div className={`avatar placeholder ${border ? "border-2 rounded-full" : ""} ${margin}`}>
      <div className={`${width} rounded-full bg-gray-300 flex items-center justify-center overflow-hidden`}>
        <span className="text-lg font-bold text-grey">{record?.displayName?.slice(0, 2).toUpperCase()}</span>
      </div>
    </div>
  );
}

export default UserImage;
