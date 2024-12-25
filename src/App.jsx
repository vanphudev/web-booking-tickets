import React, {Suspense} from "react";
import {App as AntdApp, Spin} from "antd";
import MotionLazy from "../src/components/common/motion-lazy";
import AntdConfig from "./configs/Antd";
import {RouterProvider} from "react-router-dom";
import routes from "./routes";

const App = () => {
   return (
      <AntdConfig>
         <AntdApp>
            <MotionLazy>
               <Suspense fallback={<Spin tip='Loading Website ...' size='large' />}>
                  <RouterProvider router={routes} />
               </Suspense>
            </MotionLazy>
         </AntdApp>
      </AntdConfig>
   );
};

export default App;
