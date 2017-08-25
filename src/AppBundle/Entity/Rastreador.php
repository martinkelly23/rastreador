<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Rastreador
 *
 * @ORM\Table(name="rastreador")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\RastreadorRepository")
 */
class Rastreador
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
     * @var int
     *
     * @ORM\Column(name="Numero", type="integer", unique=true)
     */
    private $numero;

    /**
     * @var string
     *
     * @ORM\Column(name="Descripcion", type="string", length=255)
     */
    private $descripcion;

    /**
     * One Rastreador has Many Informes.
     * @ORM\OneToMany(targetEntity="Informe", mappedBy="rastreador")
     */
    private $informes;

    /**
     * One Rastreador has One Vehiculo.
     * @ORM\OneToOne(targetEntity="Vehiculo", mappedBy="rastreador")
     */
    private $vehiculo;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->informes = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set numero
     *
     * @param integer $numero
     * @return Rastreador
     */
    public function setNumero($numero)
    {
        $this->numero = $numero;

        return $this;
    }

    /**
     * Get numero
     *
     * @return integer
     */
    public function getNumero()
    {
        return $this->numero;
    }

    /**
     * Set descripcion
     *
     * @param string $descripcion
     * @return Rastreador
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
     * Add informe
     *
     * @param \AppBundle\Entity\Informe $informe
     *
     * @return Rastreador
     */
    public function addInforme(\AppBundle\Entity\Informe $informe)
    {
        $this->informes[] = $informe;

        return $this;
    }

    /**
     * Remove informe
     *
     * @param \AppBundle\Entity\Informe $informe
     */
    public function removeInforme(\AppBundle\Entity\Informe $informe)
    {
        $this->informes->removeElement($informe);
    }

    /**
     * Get informes
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getInformes()
    {
        return $this->informes;
    }

    public function __toString()
    {
        return $this->descripcion;
    }

}
