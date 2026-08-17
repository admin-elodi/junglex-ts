import { Component, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('JungleX crashed:', error, info);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">
          <h1 className="text-3xl font-bold text-emerald-300 mb-3">Something went wrong in the jungle</h1>
          <p className="text-gray-400 mb-6 max-w-md">
            An unexpected error occurred. Try reloading — if it keeps happening, let us know.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-emerald-500 text-black font-bold px-5 py-2 rounded hover:bg-emerald-600"
          >
            Back to JungleX
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
