import {Form} from "antd";

const configAntd = {
   token: {
      colorBgLayout: "transparent",
      colorSuccess: "#22c55e",
      colorWarning: "#ff7849",
      colorError: "#ff5630",
      colorInfo: "#00b8d9",
      colorPrimary: "#ef5222",
      colorLink: "#ef5222",
      colorTextLabel: "#ef5222",
      wireframe: false,
      borderRadiusSM: 2,
      borderRadius: 4,
      borderRadiusLG: 8,
   },
   components: {
      Radio: {
         colorTextLabel: "#ef5222",
      },
      DatePicker: {
         colorTextLabel: "#ef5222",
         borderRadius: 8,
      },
      Select: {
         colorTextLabel: "#ef5222",
         borderRadius: 8,
      },
      Breadcrumb: {
         fontSize: 12,
         separatorMargin: 4,
      },
      Table: {
         borderRadius: 8,
      },
      Col: {
         padding: 0,
         margin: 0,
      },
      Modal: {
         borderRadius: 8,
         motionDurationMid: "0.125s",
         motionDurationSlow: "0.125s",
      },
      Layout: {
         colorBgLayout: "transparent",
      },
      Card: {
         borderRadius: 8,
      },
      Menu: {
         fontSize: 14,
         colorFillAlter: "transparent",
         itemColor: "rgb(145, 158, 171)",
         motionDurationMid: "0.125s",
         motionDurationSlow: "0.125s",
      },
   },
};

export default configAntd;
