import React, {useEffect} from "react";
import {useContent} from "../hooks/common/contentContext";
import CompanyOverview from "../features/aboutUs/aboutUs";
import {Helmet} from "react-helmet";
const AboutUsPage = () => {
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
            <title>Vé chung từ - Futabus</title>
         </Helmet>
         <CompanyOverview />
      </>
   );
};

export default AboutUsPage;
