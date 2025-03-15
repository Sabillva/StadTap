"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";
import { getStadiumByName } from "../utils/stadiumUtils";

const MyStadium = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add a new state for the add post modal and posts
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Add these new states for edit functionality
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isEditingPost, setIsEditingPost] = useState(false);

  useEffect(() => {
    // Check if user is a stadium owner
    if (!user || user.userType !== "owner") {
      navigate("/");
      return;
    }

    // Find the stadium owned by this user
    const foundStadium = getStadiumByName(user.stadiumName);

    if (!foundStadium) {
      // If stadium not found, create a default one
      const newStadium = {
        id: `custom-${Date.now()}`,
        name: user.stadiumName,
        city: "Unknown",
        address: "Unknown",
        description: "No description available",
        hourlyRate: 100,
        image: `https://source.unsplash.com/random/800x600/?football,stadium&sig=${Date.now()}`,
        amenities: {
          recording: false,
          buffet: false,
          parking: true,
          shower: true,
          lockerRoom: true,
        },
        features: ["Basic Facilities"],
        rating: 4.0,
        reviews: 0,
        ownerId: user.id,
      };

      // Save to localStorage
      const storedStadiums = JSON.parse(
        localStorage.getItem("customStadiums") || "[]"
      );
      storedStadiums.push(newStadium);
      localStorage.setItem("customStadiums", JSON.stringify(storedStadiums));

      setStadium(newStadium);
    } else {
      setStadium(foundStadium);
    }

    setLoading(false);
  }, [user, navigate]);

  // Add this useEffect to load posts
  useEffect(() => {
    if (stadium) {
      // Load posts for this stadium
      const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]");
      const stadiumPosts = allPosts.filter(
        (post) => post.stadiumId === stadium.id
      );
      setPosts(stadiumPosts);
    }
  }, [stadium]);

  // Add these functions for handling posts
  const handleAddPost = () => {
    setShowAddPostModal(true);
    setPostCaption("");
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    setIsSubmittingPost(true);

    // Create a new post
    const newPost = {
      id: Date.now().toString(),
      stadiumId: stadium.id,
      imageUrl: selectedImage,
      caption: postCaption.trim(),
      createdAt: new Date().toISOString(),
      ownerId: user.id,
    };

    // Save to localStorage
    const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]");
    allPosts.push(newPost);
    localStorage.setItem("stadiumPosts", JSON.stringify(allPosts));

    // Update local state
    setPosts([...posts, newPost]);

    // Close modal and reset form
    setShowAddPostModal(false);
    setPostCaption("");
    setSelectedImage(null);
    setIsSubmittingPost(false);
  };

  // Add these functions for handling post editing and deletion
  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditCaption(post.caption || "");
    setShowEditPostModal(true);
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;

    setIsEditingPost(true);

    // Update the post
    const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]");
    const updatedPosts = allPosts.map((post) => {
      if (post.id === editingPost.id) {
        return {
          ...post,
          caption: editCaption.trim(),
          updatedAt: new Date().toISOString(),
        };
      }
      return post;
    });

    localStorage.setItem("stadiumPosts", JSON.stringify(updatedPosts));

    // Update local state
    setPosts(
      posts.map((post) => {
        if (post.id === editingPost.id) {
          return {
            ...post,
            caption: editCaption.trim(),
            updatedAt: new Date().toISOString(),
          };
        }
        return post;
      })
    );

    // Close modal and reset form
    setShowEditPostModal(false);
    setEditingPost(null);
    setEditCaption("");
    setIsEditingPost(false);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const handleDeletePost = () => {
    if (!postToDelete) return;

    // Delete the post
    const allPosts = JSON.parse(localStorage.getItem("stadiumPosts") || "[]");
    const updatedPosts = allPosts.filter((post) => post.id !== postToDelete.id);
    localStorage.setItem("stadiumPosts", JSON.stringify(updatedPosts));

    // Update local state
    setPosts(posts.filter((post) => post.id !== postToDelete.id));

    // Close modal
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <svg
          className="animate-spin h-10 w-10 text-green-400 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-gray-300">Loading stadium details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={
              stadium.image ||
              `https://source.unsplash.com/random/800x600/?football,stadium&sig=${stadium.id}`
            }
            alt={stadium.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">My Stadium</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Stadium Name:</div>
              <div className="font-medium text-white">{stadium.name}</div>
            </div>
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Hourly Rate:</div>
              <div className="font-medium text-white">
                {stadium.hourlyRate} AZN
              </div>
            </div>
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">City:</div>
              <div className="font-medium text-white">{stadium.city}</div>
            </div>
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Rating:</div>
              <div className="font-medium text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {stadium.rating} ({stadium.reviews} reviews)
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Description
            </h2>
            <div className="bg-[#333] p-4 rounded-lg">
              <p className="text-gray-300">{stadium.description}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Amenities</h2>
            <div className="bg-[#333] p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                {stadium.amenities &&
                  Object.entries(stadium.amenities).map(
                    ([key, value]) =>
                      value && (
                        <div key={key} className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-400 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                      )
                  )}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Go to Dashboard
            </button>
            <Link
              to="/my-stadium/edit"
              className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Edit Stadium
            </Link>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Stadium Gallery
              </h2>
              <button
                onClick={handleAddPost}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Post
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="bg-[#333] p-6 rounded-lg text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-500 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-400">
                  No posts yet. Add photos to showcase your stadium!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-[#333] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={post.imageUrl || "/placeholder.svg"}
                        alt="Stadium post"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            title="Edit post"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Delete post"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-gray-300 line-clamp-2">
                        {post.caption || "No caption"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {post.updatedAt
                          ? `Updated: ${new Date(
                              post.updatedAt
                            ).toLocaleDateString()}`
                          : `Posted: ${new Date(
                              post.createdAt
                            ).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Post Modal */}
          {showAddPostModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-white mb-4">
                  Add New Post
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Select Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                  />
                  {selectedImage && (
                    <div className="mt-2">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Selected"
                        className="h-40 object-contain mx-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="caption"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Caption (Optional)
                  </label>
                  <textarea
                    id="caption"
                    value={postCaption}
                    onChange={(e) => setPostCaption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Add a caption to your post..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddPostModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPost}
                    disabled={isSubmittingPost || !selectedImage}
                    className={`px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors ${
                      isSubmittingPost || !selectedImage
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmittingPost ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Posting...
                      </span>
                    ) : (
                      "Post"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Post Modal */}
          {showEditPostModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-white mb-4">Edit Post</h2>

                <div className="mb-4">
                  <img
                    src={editingPost?.imageUrl || "/placeholder.svg"}
                    alt="Post"
                    className="h-40 object-contain mx-auto rounded-lg"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="editCaption"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Caption
                  </label>
                  <textarea
                    id="editCaption"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Add a caption to your post..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowEditPostModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePost}
                    disabled={isEditingPost}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors ${
                      isEditingPost ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isEditingPost ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      "Update Post"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-[#2a2a2a] border-2 border-white/20 rounded-xl shadow-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-white mb-4">
                  Delete Post
                </h2>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStadium;
