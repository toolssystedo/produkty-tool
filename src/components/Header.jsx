export function Header({ isDarkMode, onToggleDarkMode }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAD3ElEQVRIibWWXWhcRRTH/2fmzr2b3bsfSRZTLLRptVQRi4rtiwpaWgXB4kNRtGJsEfEDX4QIQVTwQaR9qFgFKZZoEGmhFIIILW0fEvtSpdQvhEhp0waTkGw2u+nu5nbu3jk+bGy9uzebTUwPw8CdOTO/c8/854OwdQuIIMRCLQgkbn2GGqPqOs+GRoFmxk17W7KmAEO3DVABcpR1GAVCCTCrC8jRZz2+OTM3fbzIZ/In+8rQBG+1ANepv1e/3eORACoETU896pljub4nNabFCn6FQioigarg0xXcoDovJHjkT3v3wY4/JiVcWqmKAjy7xaBxaSWdH5ov5grDH4717y2hQPBbXf8wgAGqBRxyuTqqp3JBvE0y5CvPFIvfjD93r4+iAC+NaViDRukLunJVu65wHBFzCJpSrjn2wd/D703DAN4SjOYbDQBAKMwFbTGKOWQrAgMGmJePPVDiw1c+2llCXiL4PwADArtxijlkWf+Jt0oAvd8zMXrw2kMdASoicuO3AAjMRDE+Mp7oyDS4M+DJ9Wu8C/svHX15BuWIdLUAkHjjyJ27D2X3fXpHZV7AbojTEDz5/Pap0Y8LKK0AwIDFSPPARZV4sevoqRQcEzFOW+vXiQO7BPRyAfhXtzYjzS98mdr5btfsjIaisJ4lqtb2+21UlwUggOq3BTOfv1AeGiqZ4OYEDJKARSTBHHZfPGRjoDVXSsFCpJpwnb56qXDktbFsNqY1n/ihOJsPIGvdFpQ6+5sPFQrIikiF5nKZtc++z9pnsAETcrRvh//5W7NtTpDP2waBUuQ4dPbH0hOPuJ1ZAdsavUa9gzeQFosDAO1zPledK9UA0D5rHXz75uTmu9seftCDJwDRnoFSpFSgLFKKLv5e3vF08ruTyT0DQKpeqfWAwGByyi9VSPvG81j7vGmjs2ebBDTmF0IjQjIplCJHBWk3+OVyZltv98/jCi7Xn2P1AEbaFfG4GJuoxtvorg32hnU2JCFo0D4j5kJZsm+g+8BwGglG3CDqho9IUfc9se6NtVVmGETMLgAnGPop/fihLFjADSAWVWM9AAQYrtNyyGxTLFivfrLm+MUYMoCMSMviAKoTcdgkw+Kvv8/sPZxCipA2IGo+ewNAYvBXASRAGly9eQGBAMf8dcnZtb9jZEqinSGw5NQ1C+eOAJ/7TzhIZCCSoBhIQDEb9H3Rvvn1zpE5gru815jE2i4Q3SoxGjwddMbsrfe5lHBA6tQ5temd5LnLFjKAoJBzC4Wi36YeoUKZtbIwQ7AFXIJc4du0QUU1ixMSVNCMDEG0euZGWtOh4va9TVfP/gEMinKxZLwc7wAAAABJRU5ErkJggg=="
              alt="Logo"
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Shoptet XLSX Processor</h1>
              <p className="text-sm text-gray-500">Automatické přiřazení souvisejících a podobných produktů</p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            title={isDarkMode ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
          >
            {isDarkMode ? (
              <span className="text-xl">☀️</span>
            ) : (
              <span className="text-xl">🌙</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
