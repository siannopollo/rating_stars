// rating_stars.js
//  
// dependencies: prototype.js, lowpro.js
//  
// ====================================
//  
// Rating stars is a javascript library to easily allow you to having a rating
// widget (or many rating widgets) on a page, and submit that rating back to a
// server via Ajax.
//  
// Usage
//  
//   <div id="widget"></div>
//    
//   <script type="text/javascript">
//     new RatingStars.Widget({
//       'holder': 'widget',
//       'url': '/url/for/submission'
//     });
//   </script>
//  
// ====================================
//  
// Copyright (c) 2009, Steve Iannopollo
// http://github.com/siannopollo/rating_stars
//  
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//  
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//  
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
//  
// The stars for this widget were taken from the Silk icon collection
// (http://www.famfamfam.com/lab/icons/silk/) and used under the Creative
// Commons Attribution 2.5 License.


var RatingStars = {
  StarsImage: '/images/stars.png',
  StarFrameImage: '/images/star_frame.png',
  StarMaskImage: '/images/mask.png',
  height: 20,
  width: 104,
  padding: 10, // Padding on either side of the stars
  starWidth: 84 // The width taken up by the stars
}

RatingStars.Widget = Class.create({
  initialize: function(options) {
    var options = Object.extend({
      initialMessage: 'Click to submit',
      submittedMessage: 'Thanks for voting!',
      rating: 0,
      readOnly: false
    }, options);
    
    this.holder = $(options.holder);
    this.widgetHolder = $span();
    this.messageHolder = $span(options.initialMessage);
    this.stars = $img({'src': RatingStars.StarsImage, 'height': RatingStars.height, 'width': RatingStars.width});
    this.frame = $img({'src': RatingStars.StarFrameImage, 'height': RatingStars.height, 'width': RatingStars.width});
    this.mask = $div();
    
    this.url = options.url
    this.rating = options.rating;
    this.message = options.initialMessage;
    this.submitted = options.readOnly;
    this.submittedMessage = options.submittedMessage;
    
    this._placeElements();
    this._initializeStyles();
    
    if (this.rating > 0) this._updateMaskFromRating();
    
    if (!this.submitted) {
      this.widgetHolder.observe('mousemove', this.onmousemove.bind(this));
      this.widgetHolder.observe('mouseover', this.onmouseover.bind(this));
      this.widgetHolder.observe('mouseout', this.onmouseout.bind(this));
      this.widgetHolder.observe('click', this.onclick.bind(this));
    } else this._updateMessage();
  },
  
  onclick: function(event) {
    if (!this.submitted) {
      this.submitted = true;
      this.update(event.clientX, { updateMessage: false });
      
      new Ajax.Request(this.url, {
        method: 'post',
        evalJS: false,
        parameters: {rating: this.rating},
        onSuccess: this._finalize.bind(this),
        onComplete: this.onmouseout.bind(this)
      });
    };
  },
  
  onmousemove: function(event) {
    if (!this.submitted) this.update(event.clientX);
  },
  
  onmouseover: function(event) {
    if (!this.submitted) {
      this.holder.setStyle('cursor:pointer');
      this.stars.setStyle('opacity:1; filter:alpha(opacity=100)');
    };
  },
  
  onmouseout: function(event) {
    this.holder.setStyle('cursor:default');
    this.stars.setStyle('opacity:0.7; filter:alpha(opacity=70)');
  },
  
  update: function(x, options) {
    var options = Object.extend({ updateMessage: true }, options);
    
    var offsetX = x - this.holder.positionedOffset().left;
    this._updateMask(offsetX);
    this._updateRating(offsetX);
    if (options.updateMessage) this._updateMessage();
  },
  
  _placeElements: function() {
    this.widgetHolder.insert(this.stars);
    this.widgetHolder.insert(this.frame);
    this.widgetHolder.insert(this.mask);
    this.holder.insert(this.widgetHolder);
    this.holder.insert(this.messageHolder);
  },
  
  _initializeStyles: function() {
    this.holder.setStyle('position:relative');
    this.stars.setStyle('position:absolute; z-index:2; left:0; opacity:0.7; filter:alpha(opacity=70)');
    this.mask.setStyle(
      'display:inline; background:url(' + RatingStars.StarMaskImage + ') repeat;' +
      'height:' + RatingStars.height + 'px; width:0px; position:absolute; z-index:3; left:0px'
    );
    this.frame.setStyle('position:absolute; z-index:4; left:0');
    this.messageHolder.setStyle(
      'display:inline; height:' + RatingStars.height + 'px;' +
      'padding-left:' + RatingStars.width + 'px; font-size:70%; vertical-align:5%'
    );
  },
  
  _finalize: function(response) {
    this._updateMessage(response.responseText);
  },
  
  _updateMask: function(x) {
    var width = RatingStars.width - x;
    var left = x;
    this.mask.setStyle('width:' + width + 'px; left:' + left + 'px');
  },
  
  _updateMaskFromRating: function() {
    var calculatedClientX = Math.round(((this.rating / 100) * RatingStars.starWidth) + RatingStars.padding);
    this._updateMask(calculatedClientX);
  },
  
  _updateMessage: function(optionalMessage) {
    if (optionalMessage && !optionalMessage.blank()) {
      this.message = optionalMessage.strip();
    } else {
      if (this.submitted) this.message = this.submittedMessage + ' (' + this.rating + '%)';
      else this.message = this.rating + '% Rating';
    }
    
    this.messageHolder.innerHTML = this.message
  },
  
  _updateRating: function(x) {
    if (x <= RatingStars.padding) this.rating = 0;
    if (x > RatingStars.padding && (x < (RatingStars.width - RatingStars.padding)))
      this.rating = Math.round(((x - RatingStars.padding) / RatingStars.starWidth) * 100);
    if (x >= (RatingStars.width - RatingStars.padding)) this.rating = 100;
  }
})