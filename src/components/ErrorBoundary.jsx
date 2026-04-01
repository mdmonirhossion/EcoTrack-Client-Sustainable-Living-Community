import { Component } from "react";
import { FaLeaf } from "react-icons/fa";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-green-50">
          <div className="max-w-md text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                <FaLeaf className="text-4xl text-red-400" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-black text-gray-800">
              Something Went Wrong
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 font-semibold text-white transition bg-green-500 hover:bg-green-600 rounded-xl"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;