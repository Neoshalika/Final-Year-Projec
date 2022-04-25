package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Vehicle{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String no;

    private String brand;

    private String modal;

    private String photo;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Vehiclestatus vehiclestatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "vehicle")
    private List<Delivery> vehicleDeliveryList;


    public Vehicle(Integer id){
        this.id = id;
    }

    public Vehicle(Integer id, String code, String no, String brand, String modal, String photo){
        this.id = id;
        this.code = code;
        this.no = no;
        this.brand = brand;
        this.modal = modal;
        this.photo = photo;
    }

}