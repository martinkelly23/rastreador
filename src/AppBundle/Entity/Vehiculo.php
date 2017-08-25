<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Vehiculo
 *
 * @ORM\Table(name="vehiculo")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\VehiculoRepository")
 */
class Vehiculo
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="Patente", type="string", length=255, unique=true)
     */
    private $patente;

    /**
     * @var string
     *
     * @ORM\Column(name="nroMotor", type="string", length=255, unique=true)
     */
    private $nroMotor;

    /**
     * @var string
     *
     * @ORM\Column(name="Descripcion", type="string", length=255)
     */
    private $descripcion;

    /**
     * @var string
     *
     * @ORM\Column(name="Color", type="string", length=255)
     */
    private $color;

    /**
    * One Vehiculo has One Rastreador.
    * @ORM\OneToOne(targetEntity="Rastreador", inversedBy="vehiculo")
    * @ORM\JoinColumn(name="rastreador_id", referencedColumnName="id")
    */
   private $rastreador;

   /**
    * Add rastreador
    *
    * @param \AppBundle\Entity\Rastreador $rastreador
    *
    * @return Rastreador
    */
   public function SetRastreador(\AppBundle\Entity\Rastreador $rastreador)
   {
       $this->rastreador = $rastreador;

       return $this;
   }

   /**
    * Remove rastreador
    *
    * @param \AppBundle\Entity\Rastreador $rastreador
    */
   public function removeRastreador(\AppBundle\Entity\Rastreador $rastreador)
   {
       $this->rastreador->removeElement($rastreador);
   }

   /**
    * Get rastreador
    *
    * @return Rastreador
    */
   public function getRastreador()
   {
       return $this->rastreador;
   }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set patente
     *
     * @param string $patente
     * @return Vehiculo
     */
    public function setPatente($patente)
    {
        $this->patente = $patente;

        return $this;
    }

    /**
     * Get patente
     *
     * @return string
     */
    public function getPatente()
    {
        return $this->patente;
    }

    /**
     * Set nroMotor
     *
     * @param string $nroMotor
     * @return Vehiculo
     */
    public function setNroMotor($nroMotor)
    {
        $this->nroMotor = $nroMotor;

        return $this;
    }

    /**
     * Get nroMotor
     *
     * @return string
     */
    public function getNroMotor()
    {
        return $this->nroMotor;
    }

    /**
     * Set descripcion
     *
     * @param string $descripcion
     * @return Vehiculo
     */
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    /**
     * Get descripcion
     *
     * @return string
     */
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    /**
     * Set color
     *
     * @param string $color
     * @return Vehiculo
     */
    public function setColor($color)
    {
        $this->color = $color;

        return $this;
    }

    /**
     * Get color
     *
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }
}
