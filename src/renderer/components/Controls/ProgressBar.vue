<template>
    <div class="progressbar-component">
        <span class="time before">0:00</span>
        <div class="progressbar-wrapper" @mousedown="isDragging = true" @mouseup="isDragging = false" @mousemove="seek($event)">
            <div ref="progressbar" class="progressbar">
                <div class="progressbar-current" :style="{width: perc + '%'}"></div>
                <div class="dot" :style="{left: perc + '%'}"></div>
            </div>
        </div>
        <span class="time total">72:00</span>
    </div>
</template>

<script>
export default{
    data(){
        return {
            duration:200,
            current:70,
            isDragging:false
        };
    },
    methods:{
        seek(e){
            if(!this.isDragging) return;
            let x = e.pageX - this.$refs.progressbar.offsetLeft,
            w = this.$refs.progressbar.offsetWidth;
            if(x > w){
                x = w
            }
            else if(x < 0){
                x = 0
            }
            console.log(x)
            this.current = x * this.duration / w;
        }
    },
    computed:{
        perc: function(){
            return 100 * this.current / this.duration;
        }
    }
}
</script>

<style>
    .progressbar-component{
        display:flex;
        width:75%;
        height:24px;
    }

    .progressbar{
        width:100%;
        height:2px;
        background:#4b4b4d;
        position:relative;
    }

    .progressbar-wrapper{
        width:90%;
        overflow: hidden;
        height: 13px;
        padding: 11px 10px 0px 10px;
    }

    .progressbar-wrapper:hover .progressbar-current{
        background-color:var(--base-0);
    }

    .progressbar-wrapper:hover .dot{
        display: block;
    }

    .progressbar-current{
        position:relative;
        width:90%;
        background-color:var(--base-1);
        height:2px;
    }

    .dot{
        display:none;
        width:18px;
        height:18px;
        position:absolute;
        background-color:var(--base-0);
        border-radius:50%;
        margin-left: -9px;
        top: -8px;
        left:90%;
    }
</style>