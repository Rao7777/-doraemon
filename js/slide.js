var bigBox = document.getElementById('bigBox')

var _startX; //滑动开始坐标

bigBox.addEventListener('touchstart', function(e) {
    console.log('touchstart', e.changedTouches[0].clientX)
    _startX = e.changedTouches[0].clientX

})

bigBox.addEventListener('touchend', function(e) {
    console.log('touchend', _startX, e.changedTouches[0].clientX)
    var _endX = e.changedTouches[0].clientX
    if ((_endX - _startX) > 10) {
        console.log('左滑')
        document.getElementById("prevMonth").click()

    } else if ((_startX - _endX) > 10) {
        console.log('右滑')
        document.getElementById("nextMonth").click()

    }

})