import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBarClient from "../components/SideBarClient";

const SubscribedPlan = () => {
  const { id } = useParams();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [advertisement, setAdvertisement] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch(
          `https://brotein-bistro-01am.onrender.com/api/active/subs/users/${id}/meals`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch subscription data:", errorText);
          throw new Error(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();
        setSubscriptionData(data[0]); // Assuming data is an array and you want the first item
      } catch (error) {
        console.error("Failed to fetch subscription data:", error);
        setError(error.message);
      }
    };

    const fetchLatestAdvertisement = async () => {
      try {
        const response = await fetch(
          "https://brotein-bistro-01am.onrender.com/api/ads/advertisements/latest"
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch latest advertisement:", errorText);
          throw new Error(`HTTP error status: ${response.status}`);
        }

        const adData = await response.json();
        setAdvertisement(adData);
      } catch (error) {
        console.error("Failed to fetch latest advertisement:", error);
        setError(error.message);
      }
    };

    const fetchData = async () => {
      try {
        await Promise.all([
          fetchSubscriptionData(),
          fetchLatestAdvertisement(),
        ]);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();

    // Polling to fetch updated data every 10 seconds
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [id]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Error: {error}
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-2xl capitalize bg-[#F6F6F6]">
        <img
          placeholder="records"
          src="/records.svg"
          className="w-10"
          alt="Records Placeholder"
        />
        <h1>
          Hang on a sec... <br />
          Our Admin Will Provide You Access.
        </h1>
      </div>
    );
  }

  return (
    <div className="grid md:grid-flow-col lg:grid-flow-col md:col-span-2 lg:col-span-2 bg-[#F6F6F6] ">
      <SideBarClient />
      <div className="pt-20 p-2 w-full">
        <div className="grid md:grid-flow-col lg:grid-flow-col md:grid-cols-4 lg:grid-cols-4 gap-2">
          <div className="grid gap-2 w-full md:col-span-3 lg:col-span-3 bg-white p-2 rounded-2xl">
            <div className="grid gap-2 w-full md:col-span-3 lg:col-span-3 bg-white p-2 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <div className=" p-2 rounded-xl w-full h-44   bg-[#EFFCEF] border shadow-sm ">
                  <img alt="meal" className="w-10" src="/taken.svg" />
                  <h1 className="text-xl text-center md:text-xl mb-2 capitalize">
                    Meals Left:
                  </h1>
                  <h1 className="font-semibold text-center text-4xl ">
                    {subscriptionData.totalMealsLeft} /{" "}
                    {subscriptionData.totalMealsOfThatPlan}
                  </h1>
                </div>
                <div className="   p-2 rounded-xl w-full h-44  bg-[#F4F6FA] border shadow-sm">
                  <img alt="meal" className="w-10" src="/daysleft.svg" />{" "}
                  <h1 className="text-xl text-center md:text-xl mb-2  capitalize">
                    Days Left:
                  </h1>
                  <h1 className="font-semibold text-4xl  text-center">
                    {subscriptionData.totalMealsLeft}
                  </h1>
                </div>
                <div className="   p-2 rounded-xl w-full h-44  bg-[#FFEFE2] border shadow-sm">
                  <img alt="meal" className="w-10" src="/plans.svg" />{" "}
                  <div className="text-xl text-center md:text-xl mb-2 capitalize ">
                    Selected Plan:
                  </div>
                  <div className="font-semibold text-4xl text-center">
                    {subscriptionData.selectedPlan}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="   p-2 rounded-xl w-full h-44 bg-[#F6F6F6] border shadow-sm">
                  <img alt="meal" className="w-10" src="/date.svg" />{" "}
                  <div className="text-xl text-center md:text-2xl mb-2 capitalize">
                    Start Date:
                  </div>
                  <div className="font-semibold text-4xl text-center">
                    {new Date(subscriptionData.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="   p-2 rounded-xl w-full h-44 bg-[#F6F6F6] border shadow-sm">
                  <img alt="meal" className="w-10" src="/branch.svg" />{" "}
                  <div>
                    <div className="text-xl text-center md:text-2xl mb-2 capitalize">
                      Selected Branch:
                    </div>
                    <div className="font-semibold text-4xl text-center">
                      {subscriptionData.selectedBranch}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                <div className="   p-2 rounded-xl w-full col-span-2 bg-[#F6F6F6] border shadow-sm">
                  <img alt="meal" className="w-10" src="/meal.svg" />{" "}
                  <h1 className="text-xl text-center md:text-xl mb-2 capitalize">
                    Meals Taken
                  </h1>
                  <ul>
                    {subscriptionData.mealsTaken.map((meal, index) => (
                      <li
                        key={index}
                        className="mb-2 font-semibold  text-center"
                      >
                        Date: {new Date(meal.date).toLocaleDateString()} | Plan:{" "}
                        {meal.plan}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-2 rounded-2xl h-fit flex items-center justify-center">
            {advertisement && (
              <img
                alt="advertisement"
                src={advertisement.imageUrl}
                className="rounded-xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribedPlan;
