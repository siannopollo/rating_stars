var RatingStars = {
  StarsImage: '/images/stars.png',
  StarFrameImage: '/images/star_frame.png',
  StarMaskImage: '/images/mask.png',
  height: 20,
  width: 120
}

RatingStars.Widget = Class.create({
  initialize: function(holder) {
    this.holder = $(holder);
    this.stars = $img({'src': RatingStars.StarsImage, 'height': RatingStars.height, 'width': RatingStars.width});
    this.frame = $img({'src': RatingStars.StarFrameImage, 'height': RatingStars.height, 'width': RatingStars.width});
    this.mask = $div();
    
    this._placeElements();
    this._setStyles();
  },
  
  _placeElements: function() {
    this.holder.insert(this.stars);
    this.holder.insert(this.frame);
    this.holder.insert(this.mask);
  },
  
  _setStyles: function() {
    this.stars.setStyle('position:absolute; z-index:2; left:0');
    this.mask.setStyle(
      'display:inline; background:url(' + RatingStars.StarMaskImage + ') repeat;' +
      'height:' + RatingStars.height + 'px; width:' + RatingStars.width + 'px;' +
      'position:absolute; z-index:3; left:0'
    );
    this.frame.setStyle('position:absolute; z-index:4; left:0');
  }
})