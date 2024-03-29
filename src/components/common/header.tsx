import React from "react";

interface HeaderProps {
  Title: string;
  Subtitle?: string;
}

const Header = ({ Title, Subtitle }: HeaderProps) => {
  return (
    <>
      <h2 className="text-[30px] font-bold md:text-[36px] leading-[110%] text-dark-600">
        {Title}
      </h2>
      {Subtitle && (
        <p className="font-normal text-[16px] leading-[140%]">{Subtitle}</p>
      )}
    </>
  );
};

export default Header;
