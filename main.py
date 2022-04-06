elapsed = 0

listY: List[number] = []
listX: List[number] = []
sound: List[number] = []

timer_stopped = 0
timer_started = 1
timer_paused = 2

timer_state = timer_stopped
minute_step = 5
minutes = 10
remaining_minutes = minutes
presses = 1
initList()
reset()
sound = [131, 165, 196, 262, 294]

input.on_button_pressed(Button.A, on_button_pressed_a)

def initList():
    for y in range(5):
        for x in range(5):
            listX.append(x)
            listY.append(y)

def reset():
    basic.clear_screen()
    set_default_values()
    render_screen()

def stop_timer():
    global timer_state
    timer_state = timer_stopped
    basic.clear_screen()
    for index in range(3):
        led.fade_out(200)
        basic.show_leds("""
            . . . . .
            . # # # .
            . # . # .
            . # # # .
            . . . . .
        """)
        led.fade_in(300)
    reset()

def on_button_pressed_a():
    global presses, minutes, remaining_minutes
    if timer_state == timer_stopped:
        if presses == 4:
            presses = 0
            minutes = minute_step
        else:
            presses = presses + 1
            minutes = minutes + minute_step
        remaining_minutes = minutes
        render_screen()
        music.play_tone(sound[presses], music.beat(BeatFraction.HALF))

def pause_timer():    
    global timer_state
    timer_state = timer_paused
    music.start_melody(music.built_in_melody(Melodies.FUNK),
        MelodyOptions.ONCE_IN_BACKGROUND)

def start_timer():
    global timer_state
    render_screen()
    timer_state = timer_started
    music.start_melody(music.built_in_melody(Melodies.POWER_UP),
        MelodyOptions.ONCE_IN_BACKGROUND) 

def on_timer_end():
    global timer_state
    timer_state = timer_stopped
    music.start_melody(music.built_in_melody(Melodies.DADADADUM),
        MelodyOptions.ONCE_IN_BACKGROUND)
    for index in range(5):
        led.fade_out(200)
        basic.show_icon(IconNames.NO)
        led.fade_in(300)
    reset()

def on_button_pressed_ab():
    if timer_state != timer_stopped:
        stop_timer()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global timer_state
    led.fade_in()
    if timer_state != timer_started:    
        start_timer()            
    else:
        pause_timer()        
input.on_button_pressed(Button.B, on_button_pressed_b)

def set_default_values():
    global timer_state, remaining_minutes
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




def on_every_interval():
    global elapsed, remaining_minutes, timer_state
    if timer_state == timer_started:
        elapsed = elapsed + 1
        x = listX[remaining_minutes - 1]
        y = listY[remaining_minutes - 1]
        led.toggle(x, y)
        if elapsed == 60:
            elapsed = 0
            remaining_minutes = remaining_minutes - 1
            render_screen()
            music.play_tone(131, music.beat(BeatFraction.SIXTEENTH))
        if remaining_minutes <= 0:
            timer_state = timer_stopped
            on_timer_end()
    if timer_state == timer_paused:
        led.fade_out(100)
        basic.show_leds("""
            . . . . .
            . # . # .
            . # . # .
            . # . # .
            . . . . .
        """)
        led.fade_in(300)
loops.every_interval(1000, on_every_interval)
