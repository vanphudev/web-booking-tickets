import React from "react";
import {useParams} from "react-router-dom";
import News from "../features/news/news";
import {useContent} from "../hooks/common/contentContext";
import {useEffect} from "react";
import {Helmet} from "react-helmet";

const NewsPage = () => {
   const {slug} = useParams();
   console.log(slug);
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
            <title>Tin tức - Futabus</title>
         </Helmet>
         <News />;
      </>
   );
};

export default NewsPage;
