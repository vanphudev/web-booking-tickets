import {StyleProvider} from "@ant-design/cssinjs";
import {ConfigProvider, theme} from "antd";
import "antd/dist/reset.css";
import useLocale from "../../i18n/useLocale";
import configAntd from "../../configs/Antd/theme";
import React from "react";

const AntdConfig = ({children}) => {
   const {language} = useLocale();
   return (
      <ConfigProvider
         locale={language.antdLocal}
         theme={{
            token: {...configAntd.token},
            components: {...configAntd.components},
         }}>
         <StyleProvider hashPriority='high'>{children}</StyleProvider>
      </ConfigProvider>
   );
};

export default AntdConfig;
