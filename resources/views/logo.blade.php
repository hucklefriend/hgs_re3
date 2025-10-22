@extends('layout')

@section('title', 'ロゴ')
@section('current-node-title', 'ロゴ')
@section('current-node-content')
<style>

#current-tree-nodes {
  row-gap: 0px !important;
}

.node-head-text {
  color: #9fffb3; /* 薄い緑 */
  font-size: 48px;
  letter-spacing: 2px;
  text-shadow: 0 0 1px #9fffb3, 0 0 10px #9fffb3;
}

</style>
<br>
<br>
<br>
<br>
<br>
<br>
@endsection

@section('nodes')
    
    
    <section class="node" style="padding-top:0px;padding-bottom:0px;margin-bottom:0px;" id="logo1-node">
        <div class="node-head" style="margin-bottom:0px;">
            <h2 class="node-head-text" style="font-size: 30px;margin:0;">HORROR</h2>
            <span class="node-pt">●</span>
        </div>
    </section>
    <section class="node" style="padding-top:0px;padding-bottom:0px;margin-bottom:0px;" id="logo2-node">
        <div class="node-head" style="margin-bottom:0px;">
            <h2 class="node-head-text" style="font-size: 30px;margin:0;">GAME</h2>
            <span class="node-pt">●</span>
        </div>
    </section>
    <section class="node" style="padding-top:0px;padding-bottom:0px;margin-bottom:0px;" id="logo3-node">
        <div class="node-head" style="margin-bottom:0px;">
            <h2 class="node-head-text" style="font-size: 30px;margin:0;">NETWORK</h2>
            <span class="node-pt">●</span>
        </div>
    </section>

    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
@endsection
