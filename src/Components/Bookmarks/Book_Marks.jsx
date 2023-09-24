import React, { useState, useEffect } from "react";
import MainCardList from "../../UsersComponent/Users_Table"; // Import MainCardList component, update path as needed
import { getLocalData } from "../../UsersComponent/Users"; // Import getLocalData function, update path as needed
import Pagination from '../../Pagination/Pagination'; // Import Pagination component, update path as needed
import '../../Components/Bookmarks/Pagination.css'; // Import CSS, update path as needed

const Bookmarks = () => {
    // State for bookmarked user data
    const [bookmarkData, setBookmarkData] = useState([]);

    // State for current page and search term
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // Number of items per page
    const itemsPerPage = 15;

    // Fetch bookmarked user data on component load
    useEffect(() => {
        const udata_arr_obj = getLocalData("github_users");
        const bkmrks_arr = getLocalData("github_bkmrk_users");

        const bookmarkedUsers = udata_arr_obj.filter(user => bkmrks_arr.includes(user.id));
        setBookmarkData(bookmarkedUsers);
    }, []);

    // Filter bookmarked users based on search query
    const filteredData = bookmarkData.filter(user =>
        user.login.toLowerCase().includes(search.toLowerCase())
    );

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate index of first and last item on current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            {/* Render MainCardList component */}
            <MainCardList
                obj={{
                    target: "bookmarks",
                    udata: currentItems, // Pass the current items for the current page
                    isLoading: false, // You can set the loading state here
                    search: search, // Pass the search value
                    updateSearch: setSearch, // Update search state
                    updateMtb: () => { }, // Placeholder function for updating MainCardList
                    paginate: () => { }, // Placeholder function for pagination
                    pagination: { showLoadMore: false } // Placeholder pagination data
                }}
            />

            {/* Render Pagination component */}
            <Pagination
                currentPage={currentPage} // Pass the current page number
                totalPages={Math.ceil(filteredData.length / itemsPerPage)} // Calculate total pages
                onPageChange={handlePageChange} 
            />
        </div>
    );
}

export default Bookmarks;
