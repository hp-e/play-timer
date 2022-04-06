let timer_started = 1
let timer_stopped = 0
let timer_paused = 2
let timer_state = timer_stopped
let fade = "in"
let remaining_minutes = 0
let minute_step = 5
let minutes = 10
let listX : number[] = []
let listY : number[] = []
let elapsed = 0
initList()
reset()
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (timer_state == timer_stopped) {
        if (minutes == 25) {
            minutes = minute_step
        } else {
            minutes = minutes + minute_step
        }
        
        remaining_minutes = minutes
        render_screen()
    }
    
})
function on_timer_end() {
    
    timer_state = timer_stopped
    led.fadeOut()
    basic.showIcon(IconNames.No)
    led.fadeIn()
    music.playMelody("C5 A B G A F G E ", 120)
    for (let x = 0; x < 5; x++) {
        led.fadeOut()
        basic.pause(500)
        led.fadeIn()
    }
    reset()
}

function stop_timer() {
    
    timer_state = timer_stopped
    basic.clearScreen()
    for (let x = 0; x < 3; x++) {
        led.fadeOut()
        basic.showLeds(`
                    . . . . .
                    . # # # .
                    . # . # .
                    . # # # .
                    . . . . .
                `)
        basic.pause(500)
        led.fadeIn()
    }
    reset()
}

function pause_timer() {
    basic.showLeds(`
                        . . . . .
                        . # . # .
                        . # . # .
                        . # . # .
                        . . . . .
                    `)
}

input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    //  led.fade_in()
    if (timer_state != timer_stopped) {
        stop_timer()
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    led.fadeIn()
    if (timer_state != timer_started) {
        render_screen()
        timer_state = timer_started
    } else {
        timer_state = timer_paused
    }
    
})
function set_default_values() {
    
    timer_state = timer_stopped
    remaining_minutes = minutes
}

function render_screen() {
    basic.clearScreen()
    let x = 0
    let y = 0
    let minIdx = remaining_minutes - 1
    for (let index = 0; index < remaining_minutes; index++) {
        x = listX[index]
        y = listY[index]
        led.plot(x, y)
    }
}

function reset() {
    basic.clearScreen()
    set_default_values()
    render_screen()
}

function initList() {
    
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            listX.push(x)
            listY.push(y)
        }
    }
}

loops.everyInterval(1000, function on_every_interval() {
    let x: number;
    let y: number;
    
    if (timer_state == timer_started) {
        elapsed = elapsed + 1
        x = listX[remaining_minutes - 1]
        y = listY[remaining_minutes - 1]
        led.toggle(x, y)
        if (elapsed == 60) {
            elapsed = 0
            remaining_minutes = remaining_minutes - 1
            render_screen()
        }
        
        if (remaining_minutes <= 0) {
            timer_state = timer_stopped
            on_timer_end()
        }
        
    }
    
    if (timer_state == timer_paused) {
        led.fadeOut(100)
        pause_timer()
        led.fadeIn(300)
    }
    
})
