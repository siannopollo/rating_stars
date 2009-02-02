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
  initialize: function(holder) {
    this.holder = $(holder);
    this.stars = $img({'src': RatingStars.StarsImage, 'height': RatingStars.height, 'width': RatingStars.width});
    this.frame = $img({'src': RatingStars.StarFrameImage, 'height': RatingStars.height, 'width': RatingStars.width});
    this.mask = $div();
    this.rating = 0;
    
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
  },
  
  onmouseout: function(event) {
    this.holder.setStyle('cursor:default');
  },
  
  _placeElements: function() {
    this.holder.insert(this.stars);
    this.holder.insert(this.frame);
    this.holder.insert(this.mask);
  },
  
  _initializeStyles: function() {
    this.stars.setStyle('position:absolute; z-index:2; left:0');
    this.mask.setStyle(
      'display:inline; background:url(' + RatingStars.StarMaskImage + ') repeat;' +
      'height:' + RatingStars.height + 'px; width:0px; position:absolute; z-index:3; left:0px'
    );
    this.frame.setStyle('position:absolute; z-index:4; left:0');
  },
  
  update: function(x) {
    this._updateMask(x);
    this._updateRating(x);
  },
  
  _updateMask: function(x) {
    var width = RatingStars.width - x;
    var left = x;
    this.mask.setStyle('width:' + width + 'px; left:' + left + 'px');
  },
  
  _updateRating: function(x) {
    this.rating = Math.round(((x - RatingStars.padding) / RatingStars.starWidth) * 100);
    // this.frame.setAttribute('alt', this.rating + '%')
  }
})