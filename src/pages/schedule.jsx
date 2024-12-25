import React, {useEffect} from "react";
import {useContent} from "../hooks/common/contentContext";
import Schedule from "../features/schedule/lich-trinh";
import {Helmet} from "react-helmet";
const SchedulePage = () => {
   const {isHeaderCustom, setIsHeaderCustom} = useContent();
   useEffect(() => {
      setIsHeaderCustom(true);
      return () => {
         setIsHeaderCustom(false);
      };
   }, []);

   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Lịch trình - Futabus</title>
         </Helmet>
         <Schedule />
      </>
   );
};

export default SchedulePage;
