import React, { useState, useEffect } from "react";

function UserImage({ record, width, border, margin }) {
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    if (!record || !record.imageUrl) {
      setUserImage(null);
      return;
    }

    const isFullUrl = String(record.imageUrl).startsWith("http");
    const imageUrl = isFullUrl
      ? record.imageUrl
      : `https://assets.csaposapp.hu/assets/images/${record.imageUrl}`;

    setUserImage(imageUrl);
  }, [record]);

  return (
    <div className={`avatar ${border ? "border-2 rounded-full" : ""} ${margin}`}>
      <div className={`${width} rounded-full bg-gray-300 flex items-center justify-center overflow-hidden`}>
        {userImage ? (
          <img src={userImage} alt="kép" className="w-full h-full object-cover" />
        ) : (
          <span className="text-md text-black font-semibold">
            {record?.displayName?.slice(0, 2).toUpperCase() || "A"}
          </span>
        )}
      </div>
    </div>
  );
}

export default UserImage;

