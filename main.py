# music.start_melody(music.built_in_melody(Melodies.BADDY),
#         MelodyOptions.ONCE_IN_BACKGROUND)
timer_started = 1
timer_stopped = 0
timer_paused = 2
timer_state = timer_stopped
# music.set_volume()
remaining_minutes = 0
minute_step = 5
minutes = 10
listX: List[number] = []
listY: List[number] = []
sound: List[number] = []
elapsed = 0
presses = 1
initList()
reset()

sound = [131, 165, 196, 262, 294]

def on_button_pressed_a():
    global minutes, remaining_minutes, presses

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
    
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_ab():    
    if timer_state != timer_stopped:
        stop_timer()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global timer_state
    led.fade_in()
    if timer_state != timer_started:
        render_screen()
        timer_state = timer_started
        music.start_melody(music.built_in_melody(Melodies.POWER_UP), MelodyOptions.ONCE_IN_BACKGROUND)
    else:
        timer_state = timer_paused
        music.start_melody(music.built_in_melody(Melodies.FUNK), MelodyOptions.ONCE_IN_BACKGROUND)

input.on_button_pressed(Button.B, on_button_pressed_b)

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
        pause_timer()
loops.every_interval(1000, on_every_interval)

def on_timer_end():
    global timer_state
    timer_state = timer_stopped
    
    music.start_melody(music.built_in_melody(Melodies.DADADADUM),
            MelodyOptions.ONCE_IN_BACKGROUND)
        
    for x2 in range(5):
        led.fade_out(200)
        basic.show_icon(IconNames.NO)        
        led.fade_in(300)

    reset()
def stop_timer():
    global timer_state
    timer_state = timer_stopped
    basic.clear_screen()
    for x3 in range(3):
        led.fade_out(200)
        basic.show_leds("""
            . . . . .
            . # # # .
            . # . # .
            . # # # .
            . . . . .
        """)
        # basic.pause(500)
        led.fade_in(300)
    reset()
def pause_timer():
    led.fade_out(100)                    
    basic.show_leds("""
        . . . . .
        . # . # .
        . # . # .
        . # . # .
        . . . . .
    """)
    led.fade_in(300)
def set_default_values():
    global timer_state, remaining_minutes
    timer_state = timer_stopped
    remaining_minutes = minutes
def render_screen():
    basic.clear_screen()
    x4 = 0
    y2 = 0
    minIdx = remaining_minutes - 1
    for index in range(remaining_minutes):
        x4 = listX[index]
        y2 = listY[index]
        led.plot(x4, y2)
def reset():
    basic.clear_screen()
    set_default_values()
    render_screen()
def initList():
    for y3 in range(5):
        for x5 in range(5):
            listX.append(x5)
            listY.append(y3)