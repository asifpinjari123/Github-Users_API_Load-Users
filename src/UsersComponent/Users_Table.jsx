import React, { useState, useEffect,useCallback } from "react";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { getLocalData } from "../UsersComponent/Users";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import '../UsersComponent/UsersTable.css';

// Function to toggle the bookmark status of a user
const toggleBookmark = (id) => {
    // Fetch existing bookmarks from local storage
    let data = getLocalData("github_bkmrk_users");
    // Toggle bookmark status based on whether the ID is present or not
    let my_need = data.includes(id) ? data.filter(val => val !== id) : [...data, id];
    // Update bookmarks in local storage
    localStorage.setItem("github_bkmrk_users", JSON.stringify(my_need));
};

// Individual User Card Component
const SingleCard = ({ obj }) => {
    // Destructure props
    let { updateMtb, bkmrks, val, target } = obj;
    let { id, login, avatar_url } = val;
    // Define and manage bookmark state for this user
    let [isBooked, updateBooked] = useState(bkmrks.includes(id));

    // Toggle bookmark status
    const toggle = (id) => {
        // Update bookmark state and storage
        updateBooked(old => !old);
        toggleBookmark(id);
        // Update "My Top Bookmarks" if target is "bookmarks"
        if (target === "bookmarks") updateMtb(old => !old);
    };

    // Display only bookmarked users if target is "bookmarks"
    if (target === "bookmarks" && !isBooked) {
        return null;
    }

    return (
        <Card className="card">
            <CardContent>
                <Typography variant="h5" component="div">
                    {login}
                </Typography>
                <Avatar alt={login} src={avatar_url} />
            </CardContent>
            <CardActions>
                {/* Toggle button for bookmark */}
                <button
                    onClick={() => toggle(id)}
                    title={isBooked ? "remove" : "add"}
                    className={`btn ${isBooked ? "btn-warning" : "btn-primary"}`}
                    type="button"
                >
                    <BookmarkBorderIcon />
                </button>
            </CardActions>
        </Card>
    );
}

// Loading Spinner Component
const Loader = () => {
    // Display loading spinner
    return (
        <Card className="card">
            <CardContent className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </CardContent>
        </Card>
    );
}

// Main List of User Cards Component
const MainCardList = ({ obj }) => {
    // Destructure props
    let { target, udata, isLoading, search, updateSearch, updateMtb, paginate, pagination } = obj;
    // Fetch existing bookmarks from local storage
    let bkmrks = getLocalData("github_bkmrk_users");
    const [isFetching, setIsFetching] = useState(false);

    // Handle scrolling for fetching more data
    const handleScroll = useCallback(() => {
        // Check if scroll position requires more data and load if conditions are met
        if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 500
        ) {
            if (!isFetching && pagination.showLoadMore) {
                setIsFetching(true);
                paginate();
            }
        }
    }, [isFetching, pagination, paginate]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <div id="respo_cards" className="container mt-3">
            {/* Live search input */}
            <div className="form-group mb-3">
                <label className="form-label">Live Search</label>
                <input
                    onChange={e => updateSearch(e.target.value.trim())}
                    value={search}
                    className="form-control me-2"
                    type="search"
                    placeholder="Live Search"
                    aria-label="Search"
                />
            </div>
            <div className="card-container">
                {/* Display loading spinner if loading */}
                {isLoading && <Loader />}
                {/* Display message card if API returns a message */}
                {udata.message && (
                    <Card className="message-card">
                        <CardContent>
                            <Typography>{udata.message}</Typography>
                        </CardContent>
                    </Card>
                )}
                {/* Map through user data and render User Cards */}
                {Array.isArray(udata) && udata.length > 0 && udata.map((val, ind) => (
                    <SingleCard key={val.id} obj={{ updateMtb, bkmrks, val, target }} />
                ))}
            </div>
            {/* Display loading spinner during pagination */}
            {isFetching && (
                <div className="loader-container">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {/* Load More button for paginated results */}
            {target === "users" && pagination.showLoadMore && (
                <div className="load-more">
                    <button onClick={paginate} type="button" className="btn btn-light">
                        Load More
                    </button>
                </div>
            )}
            {/* Display "No More Data" when pagination ends */}
            {target === "users" && !pagination.showLoadMore && (
                <div className="no-more-data">
                    <button type="button" className="btn btn-secondary" disabled>
                        No More Data
                    </button>
                </div>
            )}
        </div>
    );
}

export default MainCardList;
