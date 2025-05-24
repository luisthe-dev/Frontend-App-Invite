import Header from "@/components/main/Header";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center">
      <div className="w-full flex flex-col justify-start items-center">
        <Header />
      </div>
    </div>
  );
};

export default page;
