Element.addMethods({
  // http://lifescaler.com/2008/04/simulating-mouse-clicks-in-javascript/
  fireNative: function(element, eventName){
    if (document.createEventObject){
      // dispatch for IE
      var event = document.createEventObject();
      return element.fireEvent('on' + eventName, event);
    } else{
      // dispatch for firefox + others
      var event = document.createEvent("HTMLEvents");
      event.initEvent(eventName, true, true); // event type, bubbling, cancelable
      return !element.dispatchEvent(event);
    }
  }
});