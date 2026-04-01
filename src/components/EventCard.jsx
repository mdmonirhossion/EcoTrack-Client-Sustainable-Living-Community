import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";

const EventCard = ({ event }) => {
  const { title, description, date, location, maxParticipants, currentParticipants } = event;
  const eventDate = new Date(date);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Date badge top */}
      <div className="bg-green-500 text-white text-center py-3">
        <div className="text-2xl font-black">{eventDate.getDate()}</div>
        <div className="text-xs uppercase tracking-wider">
          {eventDate.toLocaleString("default", { month: "short" })}{" "}
          {eventDate.getFullYear()}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 flex-grow">{description}</p>

        <div className="space-y-1.5 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-green-500 flex-shrink-0" />
            <span>{eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsers className="text-green-500 flex-shrink-0" />
            <span>{currentParticipants} / {maxParticipants} participants</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;