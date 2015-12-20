module.exports =
  getInitialState: ->
    errorText: false
    _touched: false


  touch: ->
    @setState _touched: true unless @state._touched

  isTouched: -> return @state._touched

  componentWillMount: ->
    @update(@props.value)
    @props._form_handlers.setDefaultValue(@props.name, @props.value)

  componentWillReceiveProps: (nextProps) ->
    if nextProps.value != @props.value
      @update(nextProps.value)
      @props._form_handlers.setDefaultValue(nextProps.name, nextProps.value)
    else
      @check(nextProps._form_values[nextProps.name], nextProps._form_values)

  update: (value) ->
    @props._form_handlers.onChange @props.name, value
    @check(value, @props._form_values)

  check: (value, formValues) ->
    # checkValue() setted?
    if @props.checkValue
      # check!
      error = @props.checkValue(value, formValues)

      # error changed?
      if @state.errorText != error
        @setState errorText: error
        @props._form_handlers.setError(@props.name, error) # call parent <Form />

  getValue: -> @props._form_values[@props.name] if @props._form_values
