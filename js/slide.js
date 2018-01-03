var bigBox = document.getElementById('bigBox')

var _startX; //滑动开始坐标

bigBox.addEventListener('touchstart', function(e) {
    // e.preventDefault()
    // console.log('touchstart', e.changedTouches[0].clientX)
    _startX = e.changedTouches[0].clientX

})

bigBox.addEventListener('touchend', function(e) {
    // e.preventDefault()

    // console.log('touchend', _startX, e.changedTouches[0].clientX)
    var _endX = e.changedTouches[0].clientX
    if ((_endX - _startX) > 50) {
        console.log('左滑')
        document.getElementById("prevMonth").click()

    } else if ((_startX - _endX) > 50) {
        console.log('右滑')
        document.getElementById("nextMonth").click()

    }

})