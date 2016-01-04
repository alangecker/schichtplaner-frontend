require './styles/index'
React = require 'react'

module.exports = React.createClass
  displayName: 'Form'
  getInitialState: ->
    saving: false
    values: {}
    defaultValues: {}
    errors: []


  # set Default Value (mainly for the Reset-Button)
  setDefaultValue: (key, value) ->
    v = @state.defaultValues
    v[key] = value
    @setState
      saving: false
      defaultValues: v

  onChange: (key, value) ->
    v = @state.values
    v[key] = value
    @setState values: v


  # add or delete (depending on 'occured') key to @state.errors[]
  setError: (key, occured) ->
    errors = @state.errors
    if occured
      if errors.indexOf(key) == -1
        errors.push key
        @setState errors: errors
    else
      if errors.indexOf(key) != -1
       errors.splice errors.indexOf(key), 1
       @setState errors: errors


  # add _form-Props to all Children
  addProps: (children) ->
    React.Children.map children, (child) =>
      return child if typeof child != 'object' or not child
      if typeof child.type == 'function'
        React.cloneElement child,
          _form_handlers:
            onChange: @onChange
            setDefaultValue: @setDefaultValue
            setError: @setError
            submit: @submit
          _form_values: @state.values
          _form_errors: @state.errors
      else if child.props and child.props.children
        return React.cloneElement child, children: @addProps(child.props.children)
      else
        return React.cloneElement child



  # addProps: (children) ->
  #   React.Children.map children, (child) =>
  #     return React.cloneElement child if not child or not child.type
  #     # console.log child, typeof child.type
  #     if typeof child.type is 'string'
  #       if child.props and child.props.children
  #         React.cloneElement child, children: @addProps(child.props.children)
  #       else
  #         React.cloneElement child
  #
  #     else if child.type == 'undefined'
  #       return React.cloneElement child
  #     else
  #       React.cloneElement child,
  #         _form_handlers:
  #           onChange: @onChange
  #           setDefaultValue: @setDefaultValue
  #           setError: @setError
  #           submit: @submit
  #         _form_values: @state.values
  #         _form_errors: @state.errors

  submit: ->
    return unless @props.onSubmit

    if @props.onlyChanges
      # get difff
      changes = {}
      count = 0
      for key of @state.defaultValues
        if @state.values[key] != @state.defaultValues[key]
          changes[key] = @state.values[key]
          count++

      # some changes?
      if count
        @setState saving: true
        @props.onSubmit changes, @state.defaultValues
    else
      @setState saving: true
      @props.onSubmit @state.values, @state.defaultValues

  render: ->
    index = 0
    children = @addProps(@props.children)

    className = 'form'
    className += ' '+@props.className if @props.className
    className += ' saving' if @state.saving and @props.overlay
    <div className={className}>
      {children}
      {if @state.saving and @props.overlay
        <div className="overlay">
          <div className="preloader-wrapper active">
            <div className="spinner-layer spinner-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>


# {if @state.saving
#   <span>
#     <div className="preloader-wrapper active" style={{height:22,width:22,marginRight:'20px'}}>
#       <div className="spinner-layer spinner-blue-only right">
#         <div className="circle-clipper left">
#           <div className="circle"></div>
#         </div><div className="gap-patch">
#           <div className="circle"></div>
#         </div><div className="circle-clipper right">
#           <div className="circle"></div>
#         </div>
#       </div>
#     </div>
#     <a className="waves-effect waves-light btn disabled"><i className="mdi mdi-send right"></i>Speichern</a>
#   </span>
# else
#   <a className="waves-effect waves-light btn" onClick={@save}><i className="mdi mdi-send right"></i>Speichern</a>
# }
