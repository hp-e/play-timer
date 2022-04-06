timer_started = 1
timer_stopped = 0
timer_paused = 2

timer_state = timer_stopped
fade = "in"
remaining_minutes = 0
minute_step = 5
minutes = 10
listX: List[number] = []
listY: List[number] = []

elapsed = 0
initList()
reset()

def on_button_pressed_a():
    global minutes, remaining_minutes, timer_state, timer_stopped

    if timer_state == timer_stopped:
        if minutes == 25:
            minutes = minute_step
        else:
            minutes = minutes + minute_step

        remaining_minutes = minutes
        render_screen()
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_timer_end():
    global timer_state, timer_stopped
    timer_state = timer_stopped
    led.fade_out()    
    basic.show_icon(IconNames.NO)
    led.fade_in()
    music.play_melody("C5 A B G A F G E ", 120)
    for x in range(5):        
        led.fade_out()
        basic.pause(500)
        led.fade_in()
        
    reset()

def stop_timer():
    global timer_state, timer_stopped

    timer_state = timer_stopped
    basic.clear_screen()
    for x in range(3):
        led.fade_out()
        basic.show_leds("""
                    . . . . .
                    . # # # .
                    . # . # .
                    . # # # .
                    . . . . .
                """)
        basic.pause(500)
        led.fade_in()
    reset()

def pause_timer():
    basic.show_leds("""
                        . . . . .
                        . # . # .
                        . # . # .
                        . # . # .
                        . . . . .
                    """)

def on_button_pressed_ab():
    
    global timer_state, timer_stopped
    # led.fade_in()
    if timer_state != timer_stopped:                    
        stop_timer()
    
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global remaining_minutes, timer_state, timer_started, timer_paused, timer_stopped
    led.fade_in()
    if timer_state != timer_started:
        render_screen()
        timer_state = timer_started    
    else:                
        timer_state = timer_paused
     
input.on_button_pressed(Button.B, on_button_pressed_b)


def set_default_values():
    global minutes, remaining_minutes, timer_state, timer_stopped
    
    timer_state = timer_stopped
    remaining_minutes = minutes

def render_screen():    
    basic.clear_screen()    
    x = 0
    y = 0
    minIdx = remaining_minutes - 1
    for index in range(remaining_minutes):
        x = listX[index]
        y = listY[index]
        led.plot(x, y)
    
def reset():
    basic.clear_screen()
    set_default_values()
    render_screen()

def initList():
    global listX, listY
    
    for y in range(5):
        for x in range(5):
            listX.push(x)
            listY.push(y)


def on_every_interval():
    global timer_state, timer_started, timer_stopped, timer_paused, remaining_minutes, elapsed, fade
    if timer_state == timer_started:
        elapsed = elapsed + 1
        x = listX[remaining_minutes - 1]
        y = listY[remaining_minutes - 1]
        led.toggle(x, y)

        if elapsed == 60:
            elapsed = 0
            remaining_minutes = remaining_minutes - 1
            render_screen()
        
        if remaining_minutes <= 0:
            timer_state = timer_stopped
            on_timer_end()                

    if timer_state == timer_paused:        
        led.fade_out(100)
        pause_timer()                    
        led.fade_in(300)
        
loops.every_interval(1000, on_every_interval)