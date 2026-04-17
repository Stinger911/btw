import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'An unexpected error occurred.';
      let isFirestoreError = false;

      try {
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.operationType && parsed.authInfo) {
          isFirestoreError = true;
          errorMessage = `Terminal Error: Access to ${parsed.path} denied during ${parsed.operationType} protocol.`;
          if (!parsed.authInfo.userId) {
            errorMessage += ' Authentication failed: No valid credentials detected.';
          } else {
            errorMessage += ` Insufficient clearance for user ${parsed.authInfo.email || parsed.authInfo.userId}.`;
          }
        }
      } catch (e) {
        // Not a JSON error
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-cyber-black p-6 font-mono">
          <div className="cyber-card max-w-2xl border-cyber-red p-8">
            <div className="scanline" />
            <div className="mb-6 flex items-center gap-4 text-cyber-red">
              <span className="text-4xl font-black">! CRITICAL_FAILURE</span>
            </div>
            <div className="space-y-4">
              <p className="text-xl text-white">{errorMessage}</p>
              {isFirestoreError && (
                <div className="border-l-2 border-cyber-cyan/30 bg-cyber-cyan/5 p-4">
                  <p className="text-xs text-cyber-cyan/60 uppercase">System Recommendation:</p>
                  <p className="text-sm text-gray-400">
                    Verify terminal authorization status. Admin clearance may be required for this operation.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 cyber-button-primary w-full border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-white"
            >
              REBOOT SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
