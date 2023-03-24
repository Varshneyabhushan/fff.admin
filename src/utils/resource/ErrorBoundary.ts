
import React from "react";

interface Props {
    hasError : boolean;
}

export default class ErrorBoundary extends React.Component <any, Props> {
    constructor(props : any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error : Error) {
      // Update state so the next render will show the fallback UI.
      console.log("caught error...")
      return { hasError: true };
    }
  
    componentDidCatch(error : Error, errorInfo: any) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return this.props.fallback
      }
  
      return this.props.children; 
    }
  }