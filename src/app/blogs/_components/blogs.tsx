"use client";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import blogimg1 from "../../../../public/blogimg1.png";
import blogimg2 from "../../../../public/blogimg2.png";
import blogimg3 from "../../../../public/blogimg3.png";
import blogimg4 from "../../../../public/blogimg4.png";
import blogimg5 from "../../../../public/blogimg5.png";
import blogimg6 from "../../../../public/blogimg6.png";
import blog7 from "../../../../public/blog7.png";
import blog8 from "../../../../public/blog8.png";
import blog9 from "../../../../public/blog9.png";
import blog10 from "../../../../public/blog10.png";
import blog11 from "../../../../public/blog11.png";
import blog12 from "../../../../public/blog12.png";
import bloglast2 from "../../../../public/bloglast2.png";
import bloglast3 from "../../../../public/bloglast3.png";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  image: StaticImageData;
  desc?: string;
}

interface ImageItem {
  src: string;
  alt: string;
}
interface BlogProps {
  blogdata: {};
}

const Blogs: React.FC<BlogProps> = ({ blogdata }) => {
  const posts: Post[] = [
    {
      id: 1,
      title:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: blogimg3,
      desc: "when an unknown printer took a galley of type and scrambled it to make a type sbut also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    {
      id: 2,
      title:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: blogimg4,
      desc: "not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    {
      id: 3,
      title:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: blogimg5,
      desc: "when an unknown printer took a galley of type and scrambled it to make a type sbut also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
  ];

  const trendpost: Post[] = [
    {
      id: 1,
      title:
        "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived",
      image: blog7,
    },
    {
      id: 2,
      title:
        "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived",
      image: blog8,
    },
    {
      id: 3,
      title:
        "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived",
      image: blog9,
    },
    {
      id: 4,
      title:
        "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived",
      image: blog10,
    },
    {
      id: 5,
      title:
        "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived",
      image: blog11,
    },
    {
      id: 6,
      title:
        "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived",
      image: blog12,
    },
  ];
  const Images: ImageItem[] = [
    {
      src: "/blog11.png",
      alt: "#_",
    },
    {
      src: "/blog7.png",
      alt: "#_",
    },
    {
      src: "/blog8.png",
      alt: "#_",
    },
    {
      src: "/blog9.png",
      alt: "#_",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const handleImageClick = (index: number) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };

  return (
    <div className="font-Outfit">
      <div
        className="h-[90vh] font-Outfit bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${blogdata?.blogsbanner?.background_image})`,
        }}
      >
        <div className="flex h-full container mx-auto relative justify-center items-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mt-28 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Lorem Ipsum is simply dummy text of the
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl">
              Lorem Ipsum is simply dummy text of the
            </h2>
          </div>
          <div className="w-1/4 p-2 bg-white absolute top-9 right-0 hidden md:block">
            <img
              src={blogdata?.blogsbanner?.image1}
              alt="Blog image 1"
              className="w-full h-auto"
            />
          </div>
          <div className="w-1/6 p-2 bg-white absolute bottom-11 left-3 hidden md:block">
            <img
              src={blogdata?.blogsbanner?.image2}
              alt="Blog image 1"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Popular section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mt-12">
          <h2 className="text-center text-3xl sm:text-4xl font-bold text-black">
            Popular Post
          </h2>
          <p className="text-center text-base sm:text-lg text-gray-500">
            Lorem Ipsum is simply dummy text of the printing industry.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="w-full md:w-1/2 p-4 space-y-2">
            <img
              src={blogdata?.blogspost[0]?.thumbnail_image}
              alt="Main Post"
              className="w-full h-auto rounded"
            />
            <h3 className="mt-2 text-xl text-black font-bold">
              {blogdata?.blogspost[0]?.heading}
            </h3>
            <p className="text-gray-500">
              {blogdata?.blogspost[0]?.short_description}{" "}
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-1/2 p-4">
            {blogdata?.blogspost.slice(1).map((post) => (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-3"
              >
                <img
                  src={post.thumbnail_image}
                  alt={post.heading}
                  className="rounded w-full sm:w-44 h-auto sm:h-44"
                />
                <div className="space-y-2">
                  <h4 className="font-bold text-black text-lg sm:text-xl">
                    {post.heading}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {post.short_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* banner section */}
      <div
        className="mt-10 w-full h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient( to left, #D9D9D900, #AA0A2F), url("/blogimg6.png")',
        }}
      >
        <div className="h-full w-full container mx-auto font-Outfit flex items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full md:w-2/5 space-y-4">
            <h1 className="font-bold text-2xl sm:text-3xl">
              Lorem Ipsum is simply dummy{" "}
            </h1>
            <p className="text-sm sm:text-base">
              when an unknown printer took a galley of type and scrambled it to
              make a type specimen book. It has survived not only five
              centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged.{" "}
            </p>
          </div>
        </div>
      </div>

      {/* trending post section */}
      <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-black">
            Trending Post
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 container mx-auto font-Outfit">
          {blogdata?.blogspost.map((post) => (
            <div
              key={post.sequence}
              className="flex flex-col justify-center gap-3 items-center w-full sm:w-[48%] md:w-[32%] mt-6"
            >
              <Link href={`/post-page/${post.slug}`}>
                <img
                  src={post.thumbnail_image}
                  alt="Post Image"
                  className="w-full h-auto"
                />
              </Link>
              <p className="text-black pl-2 text-sm sm:text-base">
                {post?.short_description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* <div className='container mx-auto my-5 px-4 sm:px-6 lg:px-8'>
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-black">Trending Post</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
        <div className='flex flex-col md:flex-row gap-4 md:gap-10'>
          <div className='w-full md:w-1/2 h-64 md:h-auto flex items-center bg-cover bg-center bg-no-repeat rounded-md' style={{backgroundImage:'url("/bloglast1.png")'}}>
            <p className='w-full md:w-1/2 text-base sm:text-lg ml-4 md:ml-10 mt-4 md:mt-36'>when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
          </div>
          <div className='w-full sm:w-1/2 md:w-[20%]'>
            <Image src={bloglast2} alt="Blog last 2" className='w-full h-auto'/>
          </div>
          <div className='w-full sm:w-1/2 md:w-[20%]'>
            <Image src={bloglast3} alt="Blog last 3" className='w-full h-auto'/>
          </div>
        </div>
      </div> */}
      <div className="flex mt-12 h-[80vh] space-x-8 w-full py-10 px-4 sm:px-6 lg:px-8">
        {Images.map((image, index) => (
          <figure
            key={index}
            className={`relative ${
              expandedIndex === index ? "flex-[2] w-96" : "w-32 flex-1"
            } h-5/6 overflow-hidden 
              bg-gray-100 rounded-3xl shadow-lg 
              transition-all duration-500 ease-in-out 
              hover:cursor-pointer 
              hover:rounded-xl 
              group perspective-1000`}
            onClick={() => handleImageClick(index)}
          >
            <div className="absolute inset-0 z-10 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              className="absolute inset-0 w-full h-full object-cover 
                transform transition-all duration-500 ease-in-out 
                group-hover:scale-110 
                group-hover:brightness-75"
              src={image.src}
              alt={image.alt}
            />
            {expandedIndex === index && (
              <div className="absolute inset-0 p-6 text-white bg-black/70 overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">{image.alt}</h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam scelerisque id nunc nec volutpat. Aenean commodo ligula
                  eget dolor. Aenean massa. Cum sociis natoque penatibus et
                  magnis dis parturient montes, nascetur ridiculus mus.
                </p>
              </div>
            )}
            <div
              className="absolute bottom-0 left-0 right-0 p-4 
                text-white opacity-0 
                transform translate-y-full 
                transition-all duration-300 
                group-hover:opacity-100 
                group-hover:translate-y-0 
                bg-gradient-to-t from-black/70 to-transparent"
            >
              <p className="text-sm font-semibold">{image.alt}</p>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
