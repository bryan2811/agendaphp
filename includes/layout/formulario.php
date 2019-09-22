<div class="campos">
    <div class="campo">
        <label for="nombre">Nombre:</label>
        <input 
        type="text" 
        placeholder="Nombre Contacto" 
        id="nombre"
        value="<?php echo ($contacto['nombre']) ? $contacto['nombre'] : ''; ?>"
        >
    </div><!--.campo-->

    <div class="campo">
        <label for="empresa">Empresa:</label>
        <input 
            type="text" 
            placeholder="Nombre Empresa" 
            id="empresa"
            value="<?php echo ($contacto['empresa']) ? $contacto['empresa'] : ''; ?>">
            
    </div><!--.campo-->

    <div class="campo">
        <label for="telefono">Teléfono:</label>
        <input 
            type="tel" 
            placeholder="Teléfono Contacto" 
            id="telefono"
            value="<?php echo ($contacto['telefono']) ? $contacto['telefono'] : ''; ?>">
    </div><!--.campo-->
</div><!--.campos-->

<div class="campo enviar">
    <?php 
        $textoBtn = ($contacto['telefono']) ? 'Guardar' : 'Añadir';
        $accion = ($contacto['telefono']) ? 'editar' : 'crear';
    ?>
    <input type="hidden" value="<?php echo $accion ?>" id="accion">
    <?php if( isset( $contacto['id' ] )) { ?>
        <input type="hidden" value="<?php echo $contacto['id']; ?>" id="id">
    <?php } ?>
    <input type="submit" value="<?php echo $textoBtn ?>">
</div><!--.campo enviar-->