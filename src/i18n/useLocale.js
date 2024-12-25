import en_US from "antd/locale/en_US";
import vi_VN from "antd/locale/vi_VN";
import {useTranslation} from "react-i18next";
import {LocalEnum} from "../entity/enum";

export const LANGUAGE_MAP = {
   [LocalEnum.VI]: {
      locale: LocalEnum.VI,
      label: "Vietnamese",
      icon: "ic-locale_vi_VN",
      antdLocal: vi_VN,
   },
   [LocalEnum.EN]: {
      locale: LocalEnum.EN,
      label: "English",
      icon: "ic-locale_en_US",
      antdLocal: en_US,
   },
};

export default function useLocale() {
   const {i18n} = useTranslation();
   const setLocale = (locale) => {
      i18n.changeLanguage(locale);
   };
   
   const locale = i18n.resolvedLanguage || LocalEnum.VI;
   const language = LANGUAGE_MAP[locale];
   return {
      locale,
      language,
      setLocale,
   };
}
