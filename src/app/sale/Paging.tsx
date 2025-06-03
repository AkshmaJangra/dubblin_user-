import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type PagingProps = {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  totalCount: number;
  pageNeighbours?: number;
};

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from: number, to: number, step = 1): number[] => {
  let i = from;
  const rangeArray: number[] = [];
  while (i <= to) {
    rangeArray.push(i);
    i += step;
  }
  return rangeArray;
};

const Paging: React.FC<PagingProps> = ({
  currentPage,
  totalPage,
  onPageChange,
  itemsPerPage,
  startIndex,
  endIndex,
  totalCount,
  pageNeighbours = 1,
}) => {
  const [pages, setPages] = useState<(number | string)[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const responsiveNeighbours = windowWidth < 640 ? 0 : pageNeighbours;

  useEffect(() => {
    const fetchPageNumbers = (): (number | string)[] => {
      const totalNumbers = responsiveNeighbours * 2 + 3;
      const totalBlocks = totalNumbers + 2;

      if (totalPage > totalBlocks) {
        let pages: (number | string)[] = [];

        const leftBound = currentPage - responsiveNeighbours;
        const rightBound = currentPage + responsiveNeighbours;
        const beforeLastPage = totalPage - 1;

        const startPage = leftBound > 2 ? leftBound : 2;
        const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

        pages = range(startPage, endPage);

        const pagesCount = pages.length;
        const singleSpillOffset = totalNumbers - pagesCount - 1;

        const leftSpill = startPage > 2;
        const rightSpill = endPage < beforeLastPage;

        if (leftSpill && !rightSpill) {
          const extraPages = range(startPage - singleSpillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
        } else if (!leftSpill && rightSpill) {
          const extraPages = range(endPage + 1, endPage + singleSpillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
        } else if (leftSpill && rightSpill) {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
        }

        return [1, ...pages, totalPage];
      }

      return range(1, totalPage);
    };

    setPages(fetchPageNumbers());
  }, [currentPage, totalPage, responsiveNeighbours]);

  const handleMoveLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPageChange(currentPage - responsiveNeighbours * 2 - 1);
  };

  const handleMoveRight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPageChange(currentPage + responsiveNeighbours * 2 + 1);
  };

  return (
    <div className="flex flex-col items-center space-y-3 my-6">
      <div className="text-sm text-gray-600 md:order-2 md:mt-3">
        Showing <span className="font-medium">{startIndex}</span> to
        <span className="font-medium"> {endIndex} </span> of
        <span className="font-medium"> {totalCount} </span> results
      </div>

      <div className="flex flex-wrap justify-center items-center space-x-1 md:order-1">
        {pages.map((page, index) => {
          if (page === LEFT_PAGE)
            return (
              <button key={index} onClick={handleMoveLeft}>
                ...
              </button>
            );
          if (page === RIGHT_PAGE)
            return (
              <button key={index} onClick={handleMoveRight}>
                ...
              </button>
            );
          return (
            <button
              key={index}
              onClick={() => onPageChange(Number(page))}
              className={`h-8 w-8 rounded ${currentPage === page ? "bg-blue-600 text-white" : "text-gray-600"}`}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Paging;
