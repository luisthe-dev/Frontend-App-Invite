import Image from "next/image";
import Link from "next/link";
import React from "react";
import background from "@/assets/images/Background.png";
import searchIcon from "@/assets/icons/searchIcon.svg";
import arrowIcon from "@/assets/icons/arrowIcon.svg";
import locationIcon from "@/assets/icons/locationIcon.svg";
import timeIcon from "@/assets/icons/timeIcon.svg";
import musicIcon from "@/assets/icons/musicIcon.svg";
import Header from "@/components/main/Header";

const page = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center">
      <div className="w-full flex flex-col justify-start items-center">
        <Header />
        <div
          className={
            "w-full min-h-[50vh] bg-[#402f77ba] flex flex-col justify-center items-center gap-5 relative"
          }
        >
          <Image
            alt="background"
            src={background}
            placeholder="blur"
            quality={100}
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
              zIndex: -1,
            }}
          />
          <div className="flex flex-col justify-center items-center gap-2 z-10 w-full">
            <h1 className="text-5xl text-white font-bold">
              Find Your Next Experience
            </h1>
            <p className="text-xl text-white font-light">
              Discover thousands of events happening near you and around the
              world
            </p>
            <div className="flex flex-col bg-white rounded-3xl p-4 pb-6 gap-4 w-5/6 lg:w-1/2 mt-6">
              <div className="flex flex-row items-center justify-start w-full">
                <div className="flex items-center justify-center w-1/12">
                  <Image src={searchIcon} alt="search" />
                </div>
                <div className="flex items-center justify-center w-10/12">
                  <input
                    type="text"
                    placeholder="Search events, artists, or venues"
                    className="w-full outline-0 text-md font-medium text-[#2a1767] placeholder:text-[#8E6FF7] placeholder:font-semibold placeholder:opacity-50"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button className="bg-[#8E6FF7] text-white px-8 py-3 rounded-xl font-semibold text-md">
                    Search
                  </button>
                </div>
              </div>
              <div className="flex flex-row items-center justify-start w-full font-medium text-sm text-[#2a1767] gap-5 px-5">
                <select>
                  <option> All Locations </option>
                </select>
                <select>
                  <option> Any Date </option>
                </select>
                <select>
                  <option> All Categories </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-start items-center mt-10 p-10 bg-white">
        <div className="flex flex-col items-center justify-start w-10/12">
          <div className="flex items-center justify-between w-full">
            <span className="block font-bold text-2xl"> Featured Events </span>
            <Link
              href={"/events"}
              className="text-[#8E6FF7] font-semibold text-md flex gap-2 items-center"
            >
              View All
              <Image src={arrowIcon} alt="view all" />
            </Link>
          </div>
          <div className="flex flex-row items-center justify-start w-full mt-5 py-5 gap-5 overflow-scroll">
            <div className="flex flex-col items-start justify-start min-w-1/4 w-1/4 bg-white rounded-2xl shadow-md">
              <div className="flex flex-col items-start justify-start w-full">
                <div className="flex items-start justify-start w-full relative h-61 p-5 rounded-2xl">
                  <Image
                    alt="background"
                    src={background}
                    placeholder="blur"
                    quality={100}
                    fill
                    sizes="100vw"
                    className="rounded-t-2xl z-10 object-cover"
                  />
                  <p className="z-20 text-sm font-semibold bg-white text-[#8E6FF7] rounded-2xl px-3 py-1 absolute">
                    Check Me
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start w-full p-3 pt-1">
                  <span className=" flex items-center justify-start gap-1 font-semibold text-[22px] my-2">
                    Comedy Night with John Mulaney
                  </span>
                  <span className="font-light text-sm text-[#4B5563] flex items-center justify-start gap-1">
                    <Image src={locationIcon} alt="Comedy Cellar, New York" />
                    Comedy Cellar, New York
                  </span>
                  <span className="flex items-center justify-start gap-1 font-light text-sm text-[#4B5563] my-1">
                    <Image src={timeIcon} alt="Comedy Cellar, New York" />
                    9:00 PM - 11:00 PM
                  </span>
                  <div className="flex items-center justify-start flex-wrap gap-2 font-semibold text-lg text-[#8E6FF7] my-2">
                    <span className="px-2 py-1 bg-[#f1f1f1] rounded-md font-semibold text-sm">
                      Silver
                    </span>
                    <span className="px-2 py-1 bg-[#f1f1f1] rounded-md font-semibold text-sm">
                      Silver
                    </span>
                    <span className="px-2 py-1 bg-[#f1f1f1] rounded-md font-semibold text-sm">
                      Silver
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-center mt-10 p-4 pb-20 bg-[#F9FAFB]">
        <div className="flex flex-col items-center justify-start w-10/12">
          <span className="font-bold text-3xl my-8"> Explore by Category </span>
          <div className="w-full flex gap-8 items-center justify-center">
            <div className="flex flex-col items-center justify-center w-1/6 rounded-2xl p-2 gap-2 py-9 bg-white shadow-md">
              <div className="flex items-center justify-center aspect-square py-5 rounded-full bg-[#8E6FF710]">
                <Image alt="music" src={musicIcon} quality={100} />
              </div>
              <p className="z-20 text-sm font-semibold bg-white text-[#8E6FF7] rounded-2xl px-3 py-1">
                Music
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/6 rounded-2xl p-2 gap-2 py-9 bg-white shadow-md">
              <div className="flex items-center justify-center aspect-square py-5 rounded-full bg-[#8E6FF710]">
                <Image alt="music" src={musicIcon} quality={100} />
              </div>
              <p className="z-20 text-sm font-semibold bg-white text-[#8E6FF7] rounded-2xl px-3 py-1">
                Music
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/6 rounded-2xl p-2 gap-2 py-9 bg-white shadow-md">
              <div className="flex items-center justify-center aspect-square py-5 rounded-full bg-[#8E6FF710]">
                <Image alt="music" src={musicIcon} quality={100} />
              </div>
              <p className="z-20 text-sm font-semibold bg-white text-[#8E6FF7] rounded-2xl px-3 py-1">
                Music
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/6 rounded-2xl p-2 gap-2 py-9 bg-white shadow-md">
              <div className="flex items-center justify-center aspect-square py-5 rounded-full bg-[#8E6FF710]">
                <Image alt="music" src={musicIcon} quality={100} />
              </div>
              <p className="z-20 text-sm font-semibold bg-white text-[#8E6FF7] rounded-2xl px-3 py-1">
                Music
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/6 rounded-2xl p-2 gap-2 py-9 bg-white shadow-md">
              <div className="flex items-center justify-center aspect-square py-5 rounded-full bg-[#8E6FF710]">
                <Image alt="music" src={musicIcon} quality={100} />
              </div>
              <p className="z-20 text-sm font-semibold bg-white text-[#8E6FF7] rounded-2xl px-3 py-1">
                Music
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/6 rounded-2xl p-2 gap-2 py-9 bg-white shadow-md">
              <div className="flex items-center justify-center aspect-square py-5 rounded-full bg-[#8E6FF710]">
                <Image alt="music" src={musicIcon} quality={100} />
              </div>
              <p className="z-20 text-sm font-semibold bg-white text-[#8E6FF7] rounded-2xl px-3 py-1">
                Music
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
