import { LazyMotion, m, domMax } from "framer-motion";

export const MotionLazy = ({ children }) => {
   return (
      <LazyMotion strict features={domMax}>
         <m.div style={{ height: "100%" }}>{children}</m.div>
      </LazyMotion>
   );
};

export default MotionLazy;
