React = require 'react'

module.exports = React.createClass
  displayName: 'Logo'
  render: ->
    <svg className="logo" xmlns="http://www.w3.org/2000/svg" height="30" width="21" version="1.1">
      <defs><clipPath id="b"><path d="m0 1.46e3h1.09e3v-1.46e3h-1.09e3v1.46e3z"/></clipPath><clipPath id="a"><path d="m158 1.38e3h860v-1.24e3h-860v1.24e3z"/></clipPath></defs><g transform="matrix(1.25 0 0 -1.25 -11.7 1.83e3)"><g transform="matrix(.0195 0 0 .0193 6.25 1.44e3)"><g clipPath="url(#b)"><g clipPath="url(#a)"><g transform="translate(477 479)"><path d="m0 0c4.07-4.06 12.9-13.4 19.2-18.4 8.62-6.75 9.95-9.67 18-17 17-15.5 27.3-25.4 42-47 7.45-11 18-26.6 22-39 9.39-29.2 6.99-53.4-15-78.6-15.5-17.8-26.4-26.5-46-38.4-23.3-14.1-48.4-31-72.9-43-18.2-8.93-34.5-16.5-53.3-24-12.5-4.99-25.8-8.55-38-14-12-5.34-23-3.33-34.7 1.33-16.8 6.72-26.9 15.9-36.6 30-8.44 12.2-16 24.6-20.5 38.9-3.66 11.8-7.63 23.4-11.5 35.1-3.92 11.7 0.286 22.4 11.9 25.8 18.8 5.4 37.8 9.95 56.6 15 13.7 3.64 27.4 7.34 41 11.2 18.5 5.31 37.1 10.5 55.4 16.4 11 3.6 14.1 4.23 24.7 9.89 4.15 2.21 4.04 8.66 3.63 12.2-0.853 7.48-7.7 14.3-16 21-16 16.9-21.3 21-37.3 35.5-17.9 16.3-38.2 35.4-56.5 51.3-16.5 14.3-24.4 30.1-33.3 48.6-4.08 8.46-8.66 19.6-8.92 28.9-0.545 19.5-0.287 15.7 0.172 23.3 0.917 15.2 3.79 30.2 6.1 45.3 3.64 23.7 7.68 47.4 11.2 71.2 1.95 13.2 3.48 26.7 5.88 39.9 3.41 18.6 7.34 37 10.9 55.6 2.66 13.9 4.11 28.1 6.23 42.1s4.68 28 6.48 42c1.09 8.54 0.075 15.9-9.01 21.4-11.9 7.16-22 17.2-33.7 24.7-10.5 6.73-25.5 15.4-36.1 22-14.5 9.07-23.2 15.7-38 26.2-14.9 10.6-29.2 22.4-43.6 33.8-14.8 11.7-21 26.3-19.5 45.3 1.15 14.4 0.234 29 0.235 43.5 0.001 49.6 0.466 99.1-0.346 149-0.19 11.6 3.44 19.8 10.6 28 20.7 23.8 40.1 48.7 61.7 71.6 16.3 17.4 35.9 31 54 47.2 16.9 15.1 37.4 2.97 54.2-24.5 5.53-9.04 10.1-15.6 2.05-24.1-13.3-14-25.5-29-38.8-43.1-9.08-9.58-19.6-17.8-28.7-27.4-7.9-8.37-11.6-12.8-18.7-21.9-3.3-4.22-7.38-9.35-10.5-13.7-10.9-14.8-9.56-35.2-7.8-52.2 2.19-21.2 3.91-43 5.63-64.8 1.21-15.4 4.5-31.2 4.83-46.6 0.172-8.06 4.29-13.7 10.8-17.2 12.5-6.81 27.4-12 41.7-15.2 16.9-3.84 26.2-7.22 43.3-13.3 20.4-7.24 38.6-17.5 57.5-28 9.37-5.19 19.8-5.18 28.4 0.836 7.07 4.95 7.52 13.7 7.3 22.3-0.466 18.5-12.3 31.7-20.5 46.7-12.2 22.5-18.6 44.9-16.9 72.3 0.975 15.1 1.4 25.9 3.85 38.4 4.64 23.8 16.9 49 33.7 66.9 6.82 7.25 9.44 10.1 16.3 17.2 13.1 13.6 31.9 20.4 50.2 21.6 44.2 2.7 73.9-21.8 95.9-56 7.96-12.4 10.6-29.2 12.4-44.3 3.93-33.3 5.8-67-6.4-99.1-5.54-14.6-15.3-27.5-22.2-41.6-13-20-27.9-34-49.1-42-7.58-2.83-13.6-7.12-17.1-15.6-4.74-11.5 0.265-22.8 12.7-22.4 12.8 0.388 23.5 0.916 36.2 1.33 23.2 0.76 34.4-0.393 48.8-10.1 34.5-23.1 64.4-49.8 98.5-73 23-15.6 47-29.6 70.7-44.2 4.53-2.79 9.39-6.63 14.3-6.88 5.91-0.303 12.7 1.46 17.9 4.48 15.2 8.92 30.1 18.5 44.5 28.6 15 10.6 18.2 14.2 31.8 26.4 17 15.3 25.2 28.4 38.7 44.7 10.6 12.8 11.2 14.9 24.2 27 11.3 10.6 14 13.6 28.1 14.1 12.5 0.464 14.6-5.73 28.1-16.1 5.21-6.25 10.8-9.15 6.77-25-3.61-14.2-9.19-21.3-17.3-33.5-10.7-16-14.4-22-27-36.3-13.9-15.7-28.7-34.9-44.6-48.8-18.8-16.4-38.3-31.8-57.1-48.2-14.8-12.9-28.4-27.4-43.6-39.8-16.4-13.3-28.8-17-50.4-3.88-26.2 15.9-51.4 37.1-77.8 52.8-5.68 3.37-61.8 33.5-86.9 46.1-5.96 3-12.9 6.08-22.1 9.21-10.3 4.28-25.3-7.28-29.6-19.5-8.8-17-14.6-30-24.6-45-5-8-25.9-49-33.6-60-11.9-16-19.4-35-13.2-55 1.72-5.42 3.7-9.27 8.83-11.5 16.4-7.08 33.4-12.7 50.3-18.5 21.1-7.28 122-37 136-41.6 24.3-7.89 48.6-15.6 72.6-24.4 6.14-2.25 16.6-10.6 21.3-15.6 8.81-9.41 13.8-15.5 19.7-26.7 11.8-22.3 20.7-45.2 20.5-71.7 1.86-31.3 5.14-61.9 9.53-93 2.74-19.4 4.36-37.7 5.84-57.4 4.28-29.5 2.57-57.6 3-89-0.486-11.7-3.08-19.7-13-23-18.7-6.18-37.9-10.7-57.1-15.1-20.8-4.75-41.8-8.91-62.9-12.5-8.27-1.41-17.1-1.7-25.4-0.454-12.9 1.95-17.5 12-17.2 24.9 7.48 38.6 17.8 65.1 25.2 100 5.19 24.5 9.27 50.1 10.9 75 1.3 19.3 1.57 38.7 1.6 58.1 0.012 7.4-2.1 14.8-2.9 22.2-1.1 10.1-8.8 13.8-16.6 16.3-17.4 5.55-35.1 10.3-52.8 15.2-37.3 10.3-74.5 20.8-112 30.4-12.9 4.17-28.9 5.89-37.5 5.83-1.08-0.01-2.14-2.09-1.4-2.83"/></g></g></g></g></g>
    </svg>