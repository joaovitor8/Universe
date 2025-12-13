"use client"

import { useState, useEffect } from 'react';
import axios from "axios";


type TypeApod = {
  hdurl: string
  url: string
  title: string
  date: string
  explanation: string
  copyright: string
  media_type: string
  thumbnail_url: string
}

type TypeApodGallery = {
  url: string
  title: string
  hdurl: string
  media_type: string
}


const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const getYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 23);
  return formatDate(yesterday);
};


export const APIsApod = () => {
  const today = new Date();

  const [pictureTheDay, setPictureTheDay] = useState<TypeApod>();
  const [galleryPictureTheDay, setGalleryPictureTheDay] = useState<TypeApodGallery[]>([]);

  const [datePhotoDay, setDatePhotoDay] = useState<Date>(today);
  const [dateGallery, setDateGallery] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });
  
  const [loading, setLoading] = useState(true);

  const apiOff = "http://127.0.0.1:4000"
  const apiOn = "https://api-universe.onrender.com"


  const GetApod = async () => {
    try {
      if (datePhotoDay > today) {
        throw new Error("Select dates before or equal to today.");
      }
      const response = await axios.get(`${apiOn}/api/apod?date=${formatDate(datePhotoDay)}`);
      setPictureTheDay(response.data);
    } catch (error) {
      console.error("Error when searching for image", error)
    }
  };


  const GetGalleryApod = async () => {
    try {
      const formtDateFrom = dateGallery.startDate ? formatDate(dateGallery.startDate) : getYesterday();
      const formatDateTo = dateGallery.endDate ? formatDate(dateGallery.endDate) : formatDate(today);

      if (new Date(formtDateFrom) > today || new Date(formatDateTo) > today) {
        throw new Error("Select dates before or equal to today.");
      }

      const response = await axios.get(`${apiOn}/api/apod/gallery?start_date=${formtDateFrom}&end_date=${formatDateTo}`);
      if (response.data.length > 100) {
        throw new Error("Maximum request limit reached! (maximum 40)");
      }
      setGalleryPictureTheDay(response.data);
    } catch (error) {
      console.error("Error fetching image:", error)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([GetApod(), GetGalleryApod()]);
      setLoading(false);
    };
    fetchData();
  }, []);


  return { loading, pictureTheDay, setDatePhotoDay, GetApod, galleryPictureTheDay, setDateGallery, GetGalleryApod};
};
