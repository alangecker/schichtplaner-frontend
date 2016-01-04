require '../styles/ImageUpload'
React = require 'react'

startX = 0
startY = 0

getOrginalWidth = (source, cb) ->
    t = $("<img/>")
    t.attr 'src', source
    console.log t, t.width()
    t.load ->
      cb(this.width)


module.exports = React.createClass
  displayName: 'ImageResizer'
  getInitialState: ->
    height: 100
    width: 100
    x: 10
    y: 10
    orginalWidth: 0

  componentDidMount: ->
    getOrginalWidth @props.source, (orginalWidth) =>
      ratio = @props.height/@props.width
      img = $(@refs.image)
      height = img.height()
      width = img.width()
      if width*ratio > height
        @setState
          height: height
          width: height/ratio
      else
        @setState
          height: width*ratio
          width: width

      @setState
        x: 0
        y: 0
        orginalWidth: orginalWidth
      @generatePicture()


  startMove: (e) ->
    container = $(@refs.container)
    maxX = $(@refs.image).width()-@state.width
    maxY = $(@refs.image).height()-@state.height
    startX = e.pageX-@state.x
    startY = e.pageY-@state.y
    container.on 'mousemove', (e) =>
      x = e.pageX-startX
      y = e.pageY-startY
      if x > 0 && x < maxX
        @setState x: e.pageX-startX
      else if x >= maxX
        startX = e.pageX-maxX
      else
        startX = e.pageX
      if y > 0 && y < maxY
        @setState y: e.pageY-startY
      else if y >= maxY
        startY = e.pageY-maxY
      else
        startY = e.pageY
    mouseup =  (e) =>
      container.off 'mousemove'
      $('body').off 'mouseup', mouseup
      @generatePicture()
    $('body').on 'mouseup',mouseup

  startResize: (e) ->
    container = $(@refs.container)
    ratio = @props.height/@props.width
    img = $(@refs.image)
    maxHeight = img.height()-@state.y
    maxWidth = img.width()-@state.x
    startWidth = @state.width

    startX = e.pageX
    startY = e.pageY
    container.on 'mousemove', (e) =>
      offsetX = Math.abs e.pageX-startX
      offsetY = Math.abs e.pageY-startY
      offset = if offsetX > offsetY then offsetX else offsetY
      if e.pageX > startX || e.pageY > startY
        newWidth = @state.width+offset
      else
        newWidth = @state.width-offset

      if newWidth > maxWidth
        newWidth = maxWidth
      if newWidth*ratio > maxHeight
        newWidth = maxHeight/ratio

      @setState
        width: newWidth
        height: newWidth*ratio

      startX = e.pageX
      startY = e.pageY


    mouseup =  (e) =>
      container.off 'mousemove'
      $('body').off 'mouseup', mouseup
      @generatePicture()
    $('body').on 'mouseup',mouseup

  generatePicture: ->
    img = $(@refs.image)

    canvas = @refs.canvas
    ctx = canvas.getContext("2d")
    ratio = @state.orginalWidth/img.width()


    ctx.drawImage(@refs.image,
      @state.x*ratio,
      @state.y*ratio,
      @state.width*ratio,
      @state.height*ratio,
      0, 0,
      @props.width,
      @props.height
    )
    @props.onChange canvas.toDataURL("image/png") if @props.onChange



  render: ->
    <div className="image-resizer" ref="container">
      <img src={@props.source} ref="image" />
      <div className="box" ref="box" onMouseDown={@startMove} style={{height:@state.height,width:@state.width,top:@state.y,left:@state.x}}/>
      <div className="edge" ref="edge" onMouseDown={@startResize} style={{top:@state.y+@state.height-5,left:@state.x+@state.width-5}}/>
      <canvas ref="canvas" height={@props.height} width={@props.width}/>
    </div>
