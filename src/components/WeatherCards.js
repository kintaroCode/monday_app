import { memo, useEffect,useState } from 'react';
import WeathersCard from './WeathersCard';
import mondaySdk from "monday-sdk-js"

const monday = mondaySdk()
monday.setToken(
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE2MDg0Njc5MCwidWlkIjozMDMxOTI1MCwiaWFkIjoiMjAyMi0wNS0xN1QwMToxNzowNC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NzcxNzE2NywicmduIjoidXNlMSJ9.X7R9ymORVX0CcbbBotMLdk_VjPmjfBWszsrkAvhUa3s"
)




export default memo(WeathersCards)