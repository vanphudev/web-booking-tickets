import React, {createContext, useContext, useState} from "react";

const ContentContext = createContext();

export const ContentProvider = ({children}) => {
   const [height, setHeight] = useState(0);
   const [width, setWidth] = useState(0);
   const [theme, setTheme] = useState("light");
   const [isHeaderCustom, setIsHeaderCustom] = useState(false);
   const [selectedRoute, setSelectedRoute] = useState({
      fromProvinceId: null,
      toProvinceId: null,
      fromProvinceName: "",
      toProvinceName: "",
   });
   const [tab, setTab] = useState("");
   const [searchParams, setSearchParams] = useState({
      from: "",
      fromName: "",
      fromId: "",
      fromTime: null,
      to: "",
      toName: "",
      toId: "",
      toTime: null,
      isReturn: false,
      ticketCount: 1,
   });

   return (
      <ContentContext.Provider
         value={{
            height,
            setHeight,
            width,
            setWidth,
            theme,
            setTheme,
            isHeaderCustom,
            setIsHeaderCustom,
            selectedRoute,
            setSelectedRoute,
            tab,
            setTab,
            searchParams,
            setSearchParams,
         }}>
         {children}
      </ContentContext.Provider>
   );
};

export const useContent = () => {
   const context = useContext(ContentContext);
   if (!context) {
      throw new Error("useContent must be used within a ContentProvider");
   }
   return context;
};
