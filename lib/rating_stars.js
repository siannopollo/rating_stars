var RatingStars = {
  StarsImage: '/images/stars2.png',
  StarFrameImage: '/images/star_frame2.png',
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
      submitted: false
    }, options);
    
    this.holder = $(options.holder);
    this.widgetHolder = $span();
    this.messageHolder = $span(options.initialMessage);
    this.stars = $img({'src': RatingStars.StarsImage, 'height': RatingStars.height, 'width': RatingStars.width});
    this.frame = $img({'src': RatingStars.StarFrameImage, 'height': RatingStars.height, 'width': RatingStars.width});
    this.mask = $div();
    
    this.rating = options.rating;
    this.message = options.initialMessage;
    this.submitted = options.submitted;
    this.submittedMessage = options.submittedMessage;
    
    this._placeElements();
    this._initializeStyles();
    
    this.holder.observe('mousemove', this.onmousemove.bind(this));
    this.holder.observe('mouseover', this.onmouseover.bind(this));
    this.holder.observe('mouseout', this.onmouseout.bind(this));
  },
  
  onmousemove: function(event) {
    this.update(event.clientX);
  },
  
  onmouseover: function(event) {
    this.holder.setStyle('cursor:pointer');
    this.stars.setStyle('opacity:1; filter:alpha(opacity=100)');
  },
  
  onmouseout: function(event) {
    this.holder.setStyle('cursor:default');
    this.stars.setStyle('opacity:0.7; filter:alpha(opacity=70)');
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
      'padding-left:' + RatingStars.width + 'px; font-size:80%; vertical-align:5%'
    );
  },
  
  update: function(x) {
    var offsetX = x - this.holder.positionedOffset().left
    this._updateMask(offsetX);
    this._updateRating(offsetX);
    this._updateMessage();
  },
  
  _updateMask: function(x) {
    var width = RatingStars.width - x;
    var left = x;
    this.mask.setStyle('width:' + width + 'px; left:' + left + 'px');
  },
  
  _updateMessage: function() {
    if (this.submitted) this.message = this.submittedMessage + ' (' + this.rating + '%)';
    else this.message = this.rating + '% Rating';
    
    this.messageHolder.innerHTML = this.message
  },
  
  _updateRating: function(x) {
    if (x <= RatingStars.padding) this.rating = 0;
    if (x > RatingStars.padding && (x < (RatingStars.width - RatingStars.padding)))
      this.rating = Math.round(((x - RatingStars.padding) / RatingStars.starWidth) * 100);
    if (x >= (RatingStars.width - RatingStars.padding)) this.rating = 100;
  }
})