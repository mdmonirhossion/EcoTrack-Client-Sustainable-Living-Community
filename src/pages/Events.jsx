import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaLeaf } from "react-icons/fa";
import SkeletonCard from "../components/SkeletonCard";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/events')
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-6 text-center text-white bg-emerald-900 py-14">
        <div className="flex justify-center mb-3">
          <FaLeaf className="text-4xl text-green-400" />
        </div>
        <h1 className="mb-2 text-4xl font-black">Upcoming Events</h1>
        <p className="max-w-xl mx-auto text-sm text-emerald-300">
          Join local green events and make a real-world impact in your community.
        </p>
      </div>

      <div className="px-6 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : events.map((event, i) => {
                const eventDate = new Date(event.date);
                const percentage = Math.round(
                  (event.currentParticipants / event.maxParticipants) * 100
                );
                return (
                  <article
                  key={event._id || i}
                  className="flex flex-col h-full overflow-hidden transition bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md"
                  >
                    {/* Date Badge */}
                    <div className="py-4 text-center text-white bg-green-500">
                      <div className="text-3xl font-black">
                        {eventDate.getDate()}
                      </div>
                      <div className="text-xs tracking-wider uppercase">
                        {eventDate.toLocaleString("default", { month: "long" })}{" "}
                        {eventDate.getFullYear()}
                      </div>
                    </div>

                    <div className="flex flex-col flex-grow p-5">
                      <h2 className="mb-2 text-base font-bold text-gray-800">
                        {event.title}
                      </h2>
                      <p className="flex-grow mb-4 text-xs text-gray-500 line-clamp-3">
                        {event.description}
                      </p>

                      {/* Details */}
                      <div className="mb-4 space-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="flex-shrink-0 text-green-500" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="flex-shrink-0 text-green-500" />
                          <span>
                            {eventDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaUsers className="flex-shrink-0 text-green-500" />
                          <span>
                            {event.currentParticipants} / {event.maxParticipants} participants
                          </span>
                        </div>
                      </div>

                      {/* Capacity bar */}
                      <div>
                        <div className="flex justify-between mb-1 text-xs text-gray-400">
                          <span>Capacity</span>
                          <span className="font-semibold text-green-600">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              percentage >= 80
                                ? "bg-red-400"
                                : percentage >= 50
                                ? "bg-yellow-400"
                                : "bg-green-400"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        {percentage >= 90 && (
                          <p className="mt-1 text-xs font-medium text-red-500">
                            Almost full!
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>

        {!loading && events.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">📅</div>
            <h3 className="mb-2 text-xl font-bold text-gray-600">
              No upcoming events
            </h3>
            <p className="text-sm text-gray-400">
              Check back soon for new community events!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;