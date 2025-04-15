"use client";

import {AutoIcon, HouseIcon, BookSvg, ClothSvg, MachineSvg, MusicSvg, OfficeSvg, SportSvg, ToolSvg, OtherSvg} from "../data/svgIcons";

export default function HomePage({ setBar, setItemCategory }) {
  // List of items with name and optional icon
  const itemList = [
    { name: 'Dom, záhrada', icon: <HouseIcon /> },
    { name: 'Náradie', icon: <ToolSvg /> },
    { name: 'Auto, motocykle', icon: <AutoIcon /> },
    { name: 'Stroje', icon: <MachineSvg /> },
    { name: 'Kancelária', icon: <OfficeSvg /> },
    { name: 'Hudba', icon: <MusicSvg /> },
    { name: 'Knihy', icon: <BookSvg /> },
    { name: 'Šport', icon: <SportSvg /> },
    { name: 'Oblečenie', icon: <ClothSvg /> },
    { name: 'Všetko', icon: <OtherSvg /> }
  ];

  // Changes field to the item user clicked
  const handleClick = (item) => {
    setItemCategory(item);
    setBar('search');
  };

  // For rendering items inside boxes
  const renderItemsInBoxes = () => {
    return itemList.map((item, index) => (
      <div className="categoryBox" key={index} onClick={() => handleClick(item.name)}>
        {/* Render the icon if available */}
        {item.icon && item.icon}
        <h1>{item.name}</h1>
      </div>
    ));
  };

  return (
    <div className="Field">
      {renderItemsInBoxes()}
    </div>
  );
}
