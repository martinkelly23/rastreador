<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Informe
 *
 * @ORM\Table(name="informe")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\InformeRepository")
 */
class Informe
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
     * @var float
     *
     * @ORM\Column(name="Latitud", type="float")
     */
    private $latitud;

    /**
     * @var float
     *
     * @ORM\Column(name="Longitud", type="float")
     */
    private $longitud;

    /**
     * @var float
     *
     * @ORM\Column(name="Altitud", type="float")
     */
    private $altitud;

    /**
     * @var float
     *
     * @ORM\Column(name="Velocidad", type="float")
     */
    private $velocidad;

    /**
     * @var float
     *
     * @ORM\Column(name="Rumbo", type="float")
     */
    private $rumbo;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="FechaYHora", type="datetime")
     */
    private $fechaYHora;

    /**
     * Many Informe have One rastreador.
     * @ORM\ManyToOne(targetEntity="Rastreador", inversedBy="informes")
     * @ORM\JoinColumn(name="rastreador_id", referencedColumnName="id")
     */
    private $rastreador;

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
     * Set latitud
     *
     * @param float $latitud
     * @return Informe
     */
    public function setLatitud($latitud)
    {
        $this->latitud = $latitud;

        return $this;
    }

    /**
     * Get latitud
     *
     * @return float
     */
    public function getLatitud()
    {
        return $this->latitud;
    }

    /**
     * Set longitud
     *
     * @param float $longitud
     * @return Informe
     */
    public function setLongitud($longitud)
    {
        $this->longitud = $longitud;

        return $this;
    }

    /**
     * Get longitud
     *
     * @return float
     */
    public function getLongitud()
    {
        return $this->longitud;
    }

    /**
     * Set altitud
     *
     * @param float $altitud
     * @return Informe
     */
    public function setAltitud($altitud)
    {
        $this->altitud = $altitud;

        return $this;
    }

    /**
     * Get altitud
     *
     * @return float
     */
    public function getAltitud()
    {
        return $this->altitud;
    }

    /**
     * Set velocidad
     *
     * @param float $velocidad
     * @return Informe
     */
    public function setVelocidad($velocidad)
    {
        $this->velocidad = $velocidad;

        return $this;
    }

    /**
     * Get velocidad
     *
     * @return float
     */
    public function getVelocidad()
    {
        return $this->velocidad;
    }

    /**
     * Set rumbo
     *
     * @param float $rumbo
     * @return Informe
     */
    public function setRumbo($rumbo)
    {
        $this->rumbo = $rumbo;

        return $this;
    }

    /**
     * Get rumbo
     *
     * @return float
     */
    public function getRumbo()
    {
        return $this->rumbo;
    }

    /**
     * Set fechaYHora
     *
     * @param \DateTime $fechaYHora
     * @return Informe
     */
    public function setFechaYHora($fechaYHora)
    {
        $this->fechaYHora = $fechaYHora;

        return $this;
    }

    /**
     * Get fechaYHora
     *
     * @return \DateTime
     */
    public function getFechaYHora()
    {
        return $this->fechaYHora;
    }

    /**
     * Set rastreador
     *
     * @param \AppBundle\Entity\Rastreador $rastreador
     *
     * @return Informe
     */
    public function setRastreador(\AppBundle\Entity\Rastreador $rastreador = null)
    {
        $this->rastreador = $rastreador;

        return $this;
    }

    /**
     * Get rastreador
     *
     * @return \AppBundle\Entity\Rastreador
     */
    public function getRastreador()
    {
        return $this->rastreador;
    }
    
}
